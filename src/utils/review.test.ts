import {Rating, RATING_TITLES} from '../const';
import {describe, expect, it} from 'vitest';
import {getReviewLength, isReviewDraft, isReviewTextValid, isReviewValid} from './review';

const textOf = (length: number) => 'a'.repeat(length);

describe('getReviewLength', () => {
  it('ignores spaces at the edges', () => {
    expect(getReviewLength('  abc  ')).toBe(3);
  });
});

describe('isReviewTextValid', () => {
  it.each([
    [49, false],
    [50, true],
    [300, true],
    [301, false],
  ])('text of %s characters is valid: %s', (length, expected) => {
    expect(isReviewTextValid(textOf(length))).toBe(expected);
  });

  it('does not count spaces at the edges', () => {
    expect(isReviewTextValid(`   ${textOf(49)}   `)).toBe(false);
    expect(isReviewTextValid(`   ${textOf(50)}   `)).toBe(true);
  });
});

describe('isReviewValid', () => {
  it('needs a rating', () => {
    expect(isReviewValid(null, textOf(60))).toBe(false);
  });

  it.each([1, 5])('accepts rating %s with a valid text', (rating) => {
    expect(isReviewValid(rating, textOf(60))).toBe(true);
  });

  it.each([0, 6, 2.5])('rejects rating %s', (rating) => {
    expect(isReviewValid(rating, textOf(60))).toBe(false);
  });

  it('rejects a valid rating with a short text', () => {
    expect(isReviewValid(4, textOf(49))).toBe(false);
  });
});

describe('isReviewDraft', () => {
  it.each([
    ['an empty draft', {rating: null, text: ''}],
    ['an unfinished draft', {rating: 4, text: 'short'}],
  ])('accepts %s', (_name, value) => {
    expect(isReviewDraft(value)).toBe(true);
  });

  it.each([
    ['null', null],
    ['a string', 'draft'],
    ['an object without rating', {text: ''}],
    ['an object without text', {rating: 4}],
    ['a rating of a wrong type', {rating: '4', text: ''}],
    ['a text of a wrong type', {rating: 4, text: 5}],
  ])('rejects %s', (_name, value) => {
    expect(isReviewDraft(value)).toBe(false);
  });
});

describe('rating stars', () => {
  it('match the rating limit: one title per star', () => {
    expect(RATING_TITLES).toHaveLength(Rating.Max);
  });
});
