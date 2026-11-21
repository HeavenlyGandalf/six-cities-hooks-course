import {useState, type ChangeEvent, type JSX, type SubmitEvent} from 'react';
import {RATING_TITLES, ReviewLength, UiText} from '../../const';
import {usePersistentState} from '../../hooks/use-persistent-state/use-persistent-state';
import {EMPTY_REVIEW_DRAFT, isReviewDraft, isReviewTextValid, isReviewValid} from '../../utils/review';
import {getReviewDraftKey} from '../../utils/storage-keys';

// Строк в поле отзыва, как в вёрстке (course/markup/offer.html).
const TEXTAREA_ROWS = 5;

const HINT_ID = 'review-hint';
const ERROR_ID = 'review-error';

interface ReviewFormProps {
  offerId: string;
}

// Отправка с задержкой и блокировкой формы появится в H8 (история 4.4).
// Пока Submit имитирует успех: форма сразу очищается.
// Оценка и текст - черновик в localStorage (H6): переживают перезагрузку и видны во второй вкладке.
function ReviewForm({offerId}: ReviewFormProps): JSX.Element {
  const [draft, setDraft, removeDraft] = usePersistentState(
    getReviewDraftKey(offerId),
    EMPTY_REVIEW_DRAFT,
    isReviewDraft,
  );
  const {rating, text} = draft;
  // Поле покидали хотя бы раз: до этого ошибка длины не показывается.
  const [isTextTouched, setIsTextTouched] = useState(false);

  const isValid = isReviewValid(rating, text);
  const hasTextError = isTextTouched && text !== '' && !isReviewTextValid(text);

  const handleRatingChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDraft({...draft, rating: Number(event.target.value)});
  };

  const handleTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setDraft({...draft, text: event.target.value});
  };

  const handleTextBlur = () => {
    setIsTextTouched(true);
  };

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValid) {
      return;
    }
    removeDraft();
    setIsTextTouched(false);
  };

  return (
    <form className="review-form" action="#" method="post" onSubmit={handleSubmit}>
      <h3 className="review-form__title">{UiText.YourReview}</h3>
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
        onBlur={handleTextBlur}
      />
      {/* role="alert": ошибка появляется, когда фокус уже ушёл из поля, иначе скринридер её не прочтёт. */}
      {hasTextError && <p className="form-error" id={ERROR_ID} role="alert">{UiText.ReviewLengthError}</p>}
      <div className="review-form__footer">
        <p className="review-form__hint" id={HINT_ID}>
          {UiText.ReviewHint} <b>{UiText.ReviewHintMin}</b>.
        </p>
        <button className="button review-form__submit" type="submit" disabled={!isValid}>{UiText.Submit}</button>
      </div>
    </form>
  );
}

export default ReviewForm;
