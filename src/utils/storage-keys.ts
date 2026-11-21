import {STORAGE_PREFIX} from '../variant';

// Часть ключа между префиксом варианта и id предложения.
const DRAFT_KEY_PART = 'draft';

// Ключ черновика отзыва к предложению offerId в localStorage.
export function getReviewDraftKey(offerId: string): string {
  return `${STORAGE_PREFIX}-${DRAFT_KEY_PART}-${offerId}`;
}
