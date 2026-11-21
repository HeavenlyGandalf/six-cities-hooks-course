import {describe, expect, it} from 'vitest';
import {getReviewLength, isReviewTextValid, isReviewValid} from './review';

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
