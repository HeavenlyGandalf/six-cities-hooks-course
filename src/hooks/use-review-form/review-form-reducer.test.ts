import {describe, expect, it} from 'vitest';
import {
  initialReviewFormState,
  reviewFormReducer,
  type ReviewFormAction,
  type ReviewFormState,
  type ReviewFormStatus,
} from './review-form-reducer';

const stateWith = (status: ReviewFormStatus, isTextTouched = false): ReviewFormState => ({status, isTextTouched});

const submit: ReviewFormAction = {type: 'submit'};
const succeed: ReviewFormAction = {type: 'succeed'};
const fail: ReviewFormAction = {type: 'fail'};
const edit: ReviewFormAction = {type: 'edit'};
const blurText: ReviewFormAction = {type: 'blurText'};

const notSubmitting: ReviewFormStatus[] = ['editing', 'success', 'error'];
const finished: ReviewFormStatus[] = ['success', 'error'];

describe('reviewFormReducer', () => {
  it('starts in editing with an untouched text field', () => {
    expect(initialReviewFormState).toEqual(stateWith('editing'));
  });

  describe('allowed transitions', () => {
    it.each(notSubmitting)(
      'submit: %s → submitting, keeps isTextTouched',
      (status) => {
        expect(reviewFormReducer(stateWith(status, true), submit)).toEqual(stateWith('submitting', true));
      },
    );

    it('succeed: submitting → success, the text field is untouched again', () => {
      expect(reviewFormReducer(stateWith('submitting', true), succeed))
        .toEqual(stateWith('success'));
    });

    it('fail: submitting → error, keeps isTextTouched', () => {
      expect(reviewFormReducer(stateWith('submitting', true), fail))
        .toEqual(stateWith('error', true));
    });

    it.each(finished)('edit: %s → editing', (status) => {
      expect(reviewFormReducer(stateWith(status, true), edit)).toEqual(stateWith('editing', true));
    });

    it.each(notSubmitting)(
      'blurText: %s marks the text field as touched',
      (status) => {
        expect(reviewFormReducer(stateWith(status), blurText)).toEqual(stateWith(status, true));
      },
    );
  });

  describe('ignored transitions return the same state object', () => {
    const ignored: [ReviewFormStatus, ReviewFormAction][] = [
      ['submitting', submit],
      ['editing', succeed],
      ['success', succeed],
      ['error', succeed],
      ['editing', fail],
      ['success', fail],
      ['error', fail],
      ['editing', edit],
      ['submitting', edit],
      ['submitting', blurText],
    ];

    it.each(ignored)('%s + %o', (status, action) => {
      const state = stateWith(status);

      expect(reviewFormReducer(state, action)).toBe(state);
    });

    it.each(notSubmitting)('blurText on an already touched field in %s', (status) => {
      const state = stateWith(status, true);

      expect(reviewFormReducer(state, blurText)).toBe(state);
    });
  });
});
