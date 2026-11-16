import {describe, expect, it} from 'vitest';
import {getRatingStars, getRatingWidth} from './rating';

describe('getRatingStars', () => {
  it.each([
    [3.1, 3],
    [4.5, 5],
    [4, 4],
    [4.8, 5],
    [0, 0],
  ])('rounds %s to %s stars', (rating, stars) => {
    expect(getRatingStars(rating)).toBe(stars);
  });

  it('keeps the value within the star limits', () => {
    expect(getRatingStars(-1)).toBe(0);
    expect(getRatingStars(7)).toBe(5);
  });
});

describe('getRatingWidth', () => {
  it.each([
    [3.1, '60%'],
    [4.5, '100%'],
    [4, '80%'],
  ])('returns width for rating %s as %s', (rating, width) => {
    expect(getRatingWidth(rating)).toBe(width);
  });
});
