import {Rating} from '../const';

// Число закрашенных звёзд: округление до целого (3.1 -> 3, 4.5 -> 5) в пределах 0..Rating.Max.
export function getRatingStars(rating: number): number {
  return Math.min(Math.max(Math.round(rating), 0), Rating.Max);
}

// Значение CSS-переменной --rating: по Rating.PercentPerStar процентов на звезду.
export function getRatingWidth(rating: number): string {
  return `${String(getRatingStars(rating) * Rating.PercentPerStar)}%`;
}
