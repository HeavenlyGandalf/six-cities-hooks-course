import {act, renderHook} from '@testing-library/react';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {sendReview} from '../../services/review-api';
import {getReviewDraftKey} from '../../utils/storage-keys';
import {useReviewForm} from './use-review-form';

vi.mock('../../services/review-api', () => ({sendReview: vi.fn()}));

const OFFER_ID = '1';
const OTHER_OFFER_ID = '2';
const DRAFT_KEY = getReviewDraftKey(OFFER_ID);
const VALID_TEXT = 'a'.repeat(60);
const SHORT_TEXT = 'a'.repeat(10);
const RATING = 4;

// Ответ сервера, который тест выдаёт сам: succeed - успех, fail - ошибка.
function deferSend() {
  // Исполнитель промиса вызывается синхронно, поэтому resolve и reject заполнены сразу.
  const handlers: {resolve?: () => void; reject?: (error: Error) => void} = {};
  const promise = new Promise<void>((resolve, reject) => {
    handlers.resolve = resolve;
    handlers.reject = reject;
  });
  vi.mocked(sendReview).mockReturnValueOnce(promise);
  return {
    succeed: () => act(async () => {
      handlers.resolve?.();
      await promise;
    }),
    fail: () => act(async () => {
      handlers.reject?.(new Error('Network error'));
      await expect(promise).rejects.toThrow();
    }),
  };
}

function renderReviewForm(offerId = OFFER_ID) {
  return renderHook(({id}) => useReviewForm(id), {initialProps: {id: offerId}});
}

function renderFilledForm() {
  const hook = renderReviewForm();
  act(() => {
    hook.result.current.changeRating(RATING);
  });
  act(() => {
    hook.result.current.changeText(VALID_TEXT);
  });
  return hook;
}

beforeEach(() => {
  vi.mocked(sendReview).mockReset();
});

afterEach(() => {
  localStorage.clear();
});

describe('useReviewForm: editing', () => {
  it('starts with an empty form that cannot be sent', () => {
    const {result} = renderReviewForm();

    expect(result.current).toMatchObject({rating: null, text: '', isValid: false, isSubmitting: false, isError: false});
  });

  it('restores the draft of this offer only', () => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({rating: RATING, text: 'Nice flat'}));

    expect(renderReviewForm().result.current).toMatchObject({rating: RATING, text: 'Nice flat'});
    expect(renderReviewForm(OTHER_OFFER_ID).result.current).toMatchObject({rating: null, text: ''});
  });

  it('saves rating and text to the draft and becomes valid', () => {
    const {result} = renderFilledForm();

    expect(result.current).toMatchObject({rating: RATING, text: VALID_TEXT, isValid: true});
    expect(JSON.parse(localStorage.getItem(DRAFT_KEY) ?? '')).toEqual({rating: RATING, text: VALID_TEXT});
  });

  it('shows the text error only after the field loses focus', () => {
    const {result} = renderReviewForm();

    act(() => {
      result.current.changeText(SHORT_TEXT);
    });
    expect(result.current.hasTextError).toBe(false);

    act(() => {
      result.current.blurText();
    });
    expect(result.current.hasTextError).toBe(true);
  });
});

describe('useReviewForm: submit', () => {
  it('sends the review and locks the form while waiting', () => {
    deferSend();
    const {result} = renderFilledForm();

    act(() => {
      result.current.submit();
    });

    expect(sendReview).toHaveBeenCalledWith(OFFER_ID, {rating: RATING, text: VALID_TEXT});
    expect(result.current.isSubmitting).toBe(true);
  });

  it('clears the form and removes the draft after success', async () => {
    const send = deferSend();
    const {result} = renderFilledForm();
    act(() => {
      result.current.blurText();
      result.current.submit();
    });

    await send.succeed();

    expect(result.current).toMatchObject({
      rating: null, text: '', isSubmitting: false, isError: false, hasTextError: false,
    });
    expect(localStorage.getItem(DRAFT_KEY)).toBeNull();
  });

  it('keeps rating, text and draft after an error and reports it', async () => {
    const send = deferSend();
    const {result} = renderFilledForm();
    act(() => {
      result.current.submit();
    });

    await send.fail();

    expect(result.current).toMatchObject({rating: RATING, text: VALID_TEXT, isSubmitting: false, isError: true});
    expect(JSON.parse(localStorage.getItem(DRAFT_KEY) ?? '')).toEqual({rating: RATING, text: VALID_TEXT});
  });

  it('can be sent again after an error', async () => {
    const firstSend = deferSend();
    const {result} = renderFilledForm();
    act(() => {
      result.current.submit();
    });
    await firstSend.fail();

    const secondSend = deferSend();
    act(() => {
      result.current.submit();
    });
    expect(result.current).toMatchObject({isSubmitting: true, isError: false});

    await secondSend.succeed();
    expect(sendReview).toHaveBeenCalledTimes(2);
    expect(result.current.text).toBe('');
  });
});
