import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {REVIEW_SUBMIT_STUB_DELAY_MS} from '../const';
import {sendReview} from './review-api';

describe('sendReview stub', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('resolves only after the stub delay', async () => {
    const onDone = vi.fn();
    void sendReview('1', {rating: 4, text: 'Nice flat'}).then(onDone);

    await vi.advanceTimersByTimeAsync(REVIEW_SUBMIT_STUB_DELAY_MS - 1);
    expect(onDone).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(1);
    expect(onDone).toHaveBeenCalledOnce();
  });
});
