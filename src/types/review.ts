import type {Host} from './user';

export interface Review {
  id: string;
  // ISO-строка, как отдаёт сервер.
  date: string;
  user: Host;
  comment: string;
  rating: number;
}

// Черновик формы отзыва в localStorage (H6). rating null - звезда ещё не выбрана.
export interface ReviewDraft {
  rating: number | null;
  text: string;
}
