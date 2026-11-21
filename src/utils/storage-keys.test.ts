import {describe, expect, it} from 'vitest';
import {STORAGE_PREFIX} from '../variant';
import {getReviewDraftKey} from './storage-keys';

describe('getReviewDraftKey', () => {
  it('builds the key from the variant prefix and the offer id', () => {
    expect(getReviewDraftKey('7c1a')).toBe(`${STORAGE_PREFIX}-draft-7c1a`);
  });

  it('gives different offers different keys', () => {
    expect(getReviewDraftKey('1')).not.toBe(getReviewDraftKey('2'));
  });
});
