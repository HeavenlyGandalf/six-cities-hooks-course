import type {ChangeEvent, JSX, SubmitEvent} from 'react';
import {RATING_TITLES, ReviewLength, UiText} from '../../const';
import {useReviewForm} from '../../hooks/use-review-form/use-review-form';

// Строк в поле отзыва, как в вёрстке (course/markup/offer.html).
const TEXTAREA_ROWS = 5;

const HINT_ID = 'review-hint';
const ERROR_ID = 'review-error';
const SUBMIT_ERROR_ID = 'review-submit-error';

interface ReviewFormProps {
  offerId: string;
}

// Оценка и текст - черновик в localStorage (H6), отправка - конечный автомат (H8).
// Во время отправки fieldset блокирует всё внутри, повторный Submit ничего не отправляет.
function ReviewForm({offerId}: ReviewFormProps): JSX.Element {
  const {
    rating, text, isValid, isSubmitting, isError, hasTextError,
    changeRating, changeText, blurText, submit,
  } = useReviewForm(offerId);

  const handleRatingChange = (event: ChangeEvent<HTMLInputElement>) => {
    changeRating(Number(event.target.value));
  };

  const handleTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    changeText(event.target.value);
  };

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    submit();
  };

  return (
    <form className="review-form" action="#" method="post" aria-busy={isSubmitting || undefined} onSubmit={handleSubmit}>
      <h3 className="review-form__title">{UiText.YourReview}</h3>
      {/* disabled на fieldset блокирует звёзды, текст и кнопку разом (course/markup/states.html). */}
      <fieldset className="review-form__body" disabled={isSubmitting}>
        <fieldset className="rating-input">
          <legend className="rating-input__legend">{UiText.YourRating}</legend>
          <div className="rating-input__stars">
            {RATING_TITLES.map((title, index) => {
              const value = index + 1;
              return (
                <label key={title} className="rating-input__star">
                  <input
                    className="rating-input__control"
                    type="radio"
                    name="rating"
                    value={value}
                    checked={rating === value}
                    onChange={handleRatingChange}
                  />
                  <svg aria-hidden="true"><use href="#icon-star" /></svg>
                  <span className="visually-hidden">{title}</span>
                </label>
              );
            })}
          </div>
        </fieldset>
        <label className="visually-hidden" htmlFor="review-text">{UiText.ReviewTextLabel}</label>
        <textarea
          className={`field review-form__textarea${hasTextError ? ' field--error' : ''}`}
          id="review-text"
          name="review"
          rows={TEXTAREA_ROWS}
          minLength={ReviewLength.Min}
          maxLength={ReviewLength.Max}
          aria-describedby={hasTextError ? `${HINT_ID} ${ERROR_ID}` : HINT_ID}
          aria-invalid={hasTextError || undefined}
          placeholder={UiText.ReviewPlaceholder}
          value={text}
          onChange={handleTextChange}
          onBlur={blurText}
        />
        {/* role="alert": ошибка появляется, когда фокус уже ушёл из поля, иначе скринридер её не прочтёт. */}
        {hasTextError && <p className="form-error" id={ERROR_ID} role="alert">{UiText.ReviewLengthError}</p>}
        <div className="review-form__footer">
          <p className="review-form__hint" id={HINT_ID}>
            {UiText.ReviewHint} <b>{UiText.ReviewHintMin}</b>.
          </p>
          <button
            className="button review-form__submit"
            type="submit"
            disabled={!isValid}
            aria-busy={isSubmitting || undefined}
            aria-describedby={isError ? SUBMIT_ERROR_ID : undefined}
          >
            {isSubmitting && <span className="spinner spinner--small" aria-hidden="true" />}
            {isSubmitting ? UiText.Sending : UiText.Submit}
          </button>
        </div>
        {isError && <p className="form-error" id={SUBMIT_ERROR_ID} role="alert">{UiText.ReviewSubmitError}</p>}
      </fieldset>
    </form>
  );
}

export default ReviewForm;
