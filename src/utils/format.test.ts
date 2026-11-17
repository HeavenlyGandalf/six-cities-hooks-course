import {describe, expect, it} from 'vitest';
import {capitalize, formatReviewDate, pluralize, toDateAttribute} from './format';

describe('pluralize', () => {
  it.each([
    [1, 'Bedroom'],
    [3, 'Bedrooms'],
    [0, 'Bedrooms'],
  ])('%s -> %s', (count, word) => {
    expect(pluralize(count, 'Bedroom', 'Bedrooms')).toBe(word);
  });

  it.each([
    [1, 'adult'],
    [4, 'adults'],
  ])('%s -> %s', (count, word) => {
    expect(pluralize(count, 'adult', 'adults')).toBe(word);
  });
});

describe('capitalize', () => {
  it.each([
    ['house', 'House'],
    ['apartment', 'Apartment'],
    ['', ''],
  ])('%j -> %j', (text, result) => {
    expect(capitalize(text)).toBe(result);
  });
});

describe('formatReviewDate', () => {
  it('formats a date as month and year', () => {
    expect(formatReviewDate('2019-04-24T14:13:56.569Z')).toBe('April 2019');
  });

  it('uses UTC near the end of a day', () => {
    expect(formatReviewDate('2019-04-30T23:30:00Z')).toBe('April 2019');
  });
});

describe('toDateAttribute', () => {
  it('returns YYYY-MM-DD in UTC', () => {
    expect(toDateAttribute('2019-04-30T23:30:00Z')).toBe('2019-04-30');
    expect(toDateAttribute('2019-04-24T14:13:56.569Z')).toBe('2019-04-24');
  });
});
