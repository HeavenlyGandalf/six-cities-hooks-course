export const APP_TITLE = '6 cities';

export const ROOT_ELEMENT_ID = 'root';

// Ширины из @media вёрстки (course/markup/css), px. Сверяются тестом src/styles/breakpoints.test.ts.
export const BREAKPOINTS = {
  PHONE_MAX: 767,
  TABLET_MIN: 768,
  TABLET_MAX: 1143,
  DESKTOP_MIN: 1144,
  PHONE_WIDE_MIN: 560,
} as const;

// Рейтинг звёздами: целое число звёзд из Max, по PercentPerStar процентов ширины на звезду.
export const Rating = {
  Max: 5,
  PercentPerStar: 20,
} as const;

// Сервер работает только с этими городами (course/PROJECT.md §3.1).
export const CITIES = [
  'Paris',
  'Cologne',
  'Brussels',
  'Amsterdam',
  'Hamburg',
  'Dusseldorf',
] as const;

export type CityName = typeof CITIES[number];

// При первом открытии выбран Paris (course/PROJECT.md §3.1).
export const DEFAULT_CITY: CityName = 'Paris';

export const SORT_OPTIONS = [
  'Popular',
  'Price: low to high',
  'Price: high to low',
  'Top rated first',
] as const;

export type SortOption = typeof SORT_OPTIONS[number];

export const DEFAULT_SORT: SortOption = 'Popular';

// Адреса будущих маршрутов. Роутер подключается на этапе 3.
export const AppRoute = {
  Main: '/',
  Login: '/login',
  Favorites: '/favorites',
  Offer: '/offer',
} as const;

export const CURRENCY_SIGN = '€';

// Тексты интерфейса, как в course/markup.
export const UiText = {
  LogoLabel: 'Шесть городов - на главную',
  UserNavLabel: 'Пользователь',
  FavoriteCountLabel: 'В избранном:',
  SignIn: 'Sign in',
  SignOut: 'Sign out',
  FooterNote: 'Учебный проект',
  CitiesHeading: 'Cities',
  CitiesLabel: 'Cities',
  ViewLabel: 'View',
  ViewList: 'List',
  ViewMap: 'Map',
  MapLabel: 'Map',
  MapNote: 'Здесь - Яндекс Карты',
  PlacesToStayIn: 'places to stay in',
  SortBy: 'Sort by',
  PerNight: '/ night',
  Premium: 'Premium',
  AddToFavorites: 'Add to favorites',
  RemoveFromFavorites: 'Remove from favorites',
  RatingPrefix: 'Rating',
  RatingOf: 'of',
} as const;
