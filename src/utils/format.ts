import {PageTitle} from '../const';

// Формат даты отзыва: «April 2019». Дата берётся в UTC, чтобы не зависеть от пояса браузера.
const reviewDateFormat = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

// Длина части YYYY-MM-DD в ISO-строке.
const DATE_ATTRIBUTE_LENGTH = 10;

// Слово в числе: 1 -> one, иначе many (1 Bedroom, 3 Bedrooms).
export function pluralize(count: number, one: string, many: string): string {
  return count === 1 ? one : many;
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function formatReviewDate(isoDate: string): string {
  return reviewDateFormat.format(new Date(isoDate));
}

// Значение атрибута datetime у <time>: YYYY-MM-DD в UTC.
export function toDateAttribute(isoDate: string): string {
  return new Date(isoDate).toISOString().slice(0, DATE_ATTRIBUTE_LENGTH);
}

// Текст <title> страницы: одна строка, а не несколько текстовых узлов, иначе React предупреждает.
export function formatPageTitle(part: string): string {
  return `${PageTitle.Prefix}${part}`;
}
