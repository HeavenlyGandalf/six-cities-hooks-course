import {Rating, ReviewLength} from '../const';
import type {ReviewDraft} from '../types/review';

// Наименьшая оценка, которую можно выбрать звёздами (course/PROJECT.md §4.3).
const MIN_REVIEW_RATING = 1;

// Длина текста отзыва без пробелов по краям: пробелы не засчитываются.
export function getReviewLength(text: string): number {
  return text.trim().length;
}

export function isReviewTextValid(text: string): boolean {
  const length = getReviewLength(text);
  return length >= ReviewLength.Min && length <= ReviewLength.Max;
}

// Отзыв можно отправить: выбрана оценка от 1 до Rating.Max и длина текста в пределах ReviewLength.
export function isReviewValid(rating: number | null, text: string): boolean {
  return rating !== null
    && Number.isInteger(rating)
    && rating >= MIN_REVIEW_RATING
    && rating <= Rating.Max
    && isReviewTextValid(text);
}

// Пустая форма: с неё начинается черновик и к ней он возвращается после отправки.
export const EMPTY_REVIEW_DRAFT: ReviewDraft = {rating: null, text: ''};

// Проверка формы черновика из localStorage. Значения не проверяются на допустимость:
// черновик может быть незаконченным, а Submit проверяет isReviewValid.
export function isReviewDraft(value: unknown): value is ReviewDraft {
  return typeof value === 'object'
    && value !== null
    && 'rating' in value
    && 'text' in value
    && (value.rating === null || typeof value.rating === 'number')
    && typeof value.text === 'string';
}
