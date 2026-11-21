import type {JSX} from 'react';
import {RATING_TITLES, ReviewLength, UiText} from '../../const';

// Строк в поле отзыва, как в вёрстке (course/markup/offer.html).
const TEXTAREA_ROWS = 5;

// Статичная форма из вёрстки: поля неуправляемые, Submit выключен.
// Состояние, проверка и отправка появятся в истории 4.1.
function ReviewForm(): JSX.Element {
  return (
    <form className="review-form" action="#" method="post">
      <h3 className="review-form__title">{UiText.YourReview}</h3>
      <fieldset className="rating-input">
        <legend className="rating-input__legend">{UiText.YourRating}</legend>
        <div className="rating-input__stars">
          {RATING_TITLES.map((title, index) => (
            <label key={title} className="rating-input__star">
              <input className="rating-input__control" type="radio" name="rating" value={index + 1} />
              <svg aria-hidden="true"><use href="#icon-star" /></svg>
              <span className="visually-hidden">{title}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <label className="visually-hidden" htmlFor="review-text">{UiText.ReviewTextLabel}</label>
      <textarea
        className="field review-form__textarea"
        id="review-text"
        name="review"
        rows={TEXTAREA_ROWS}
        minLength={ReviewLength.Min}
        maxLength={ReviewLength.Max}
        aria-describedby="review-hint"
        placeholder={UiText.ReviewPlaceholder}
      />
      <div className="review-form__footer">
        <p className="review-form__hint" id="review-hint">
          {UiText.ReviewHint} <b>{UiText.ReviewHintMin}</b>.
        </p>
        <button className="button review-form__submit" type="submit" disabled>{UiText.Submit}</button>
      </div>
    </form>
  );
}

export default ReviewForm;
