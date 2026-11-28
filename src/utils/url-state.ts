import {DEFAULT_SORT, SortCode, SortType, type SortOption} from '../const';

export function parseSort(value: string): SortOption {
  switch (value) {
    case SortCode.PriceAscending: return SortType.PriceAscending;
    case SortCode.PriceDescending: return SortType.PriceDescending;
    case SortCode.RatingDescending: return SortType.RatingDescending;
    default: return DEFAULT_SORT;
  }
}

export function serializeSort(value: SortOption): string {
  switch (value) {
    case SortType.PriceAscending: return SortCode.PriceAscending;
    case SortType.PriceDescending: return SortCode.PriceDescending;
    case SortType.RatingDescending: return SortCode.RatingDescending;
    default: return SortCode.Popular;
  }
}

export function parseQuery(value: string): string {
  return value;
}

export function parseSortCode(value: string): string {
  return serializeSort(parseSort(value));
}
