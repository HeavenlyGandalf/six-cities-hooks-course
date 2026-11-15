import type {Host} from './user';

export interface Review {
  id: string;
  // ISO-строка, как отдаёт сервер.
  date: string;
  user: Host;
  comment: string;
  rating: number;
}
