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

// Адреса маршрутов. Offer - префикс ссылки на предложение, OfferPattern - шаблон маршрута с :id.
export const AppRoute = {
  Main: '/',
  Login: '/login',
  Favorites: '/favorites',
  Offer: '/offer',
  OfferPattern: '/offer/:id',
  NotFound: '*',
} as const;

// Статус авторизации: unknown - ещё проверяется, auth - вошёл, no-auth - гость.
export const AuthStatus = {
  Unknown: 'unknown',
  Auth: 'auth',
  NoAuth: 'no-auth',
} as const;

export type AuthStatusValue = typeof AuthStatus[keyof typeof AuthStatus];

// Заглушка статуса до этапа 7: сервера ещё нет, пользователь считается гостем.
export const AUTH_STATUS_STUB: AuthStatusValue = AuthStatus.NoAuth;

export const CURRENCY_SIGN = '€';

// На странице предложения показывается не больше MAX_IMAGES фото (course/PROJECT.md).
export const MAX_IMAGES = 6;

// Соседних предложений на странице предложения (course/PROJECT.md).
export const MAX_NEAR_PLACES = 3;

// Фото города-ссылки на странице входа. Случайный город появится в истории 7.2.
export const LOGIN_CITY_IMAGE = '/img/offers/15.jpg';

// Длина текста отзыва, символов (course/markup/offer.html).
export const ReviewLength = {
  Min: 50,
  Max: 300,
} as const;

// Подписи звёзд формы отзыва: индекс + 1 - значение оценки.
export const RATING_TITLES = ['terribly', 'badly', 'not bad', 'good', 'perfect'] as const;

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
  Explore: 'Explore',
  EmailLabel: 'E-mail',
  EmailPlaceholder: 'you@example.com',
  PasswordLabel: 'Password',
  PasswordPlaceholder: 'Password',
  PasswordHint: 'Password must contain at least one letter and one digit',
  NotFoundCode: '404',
  NotFoundTitle: 'Not Found',
  NotFoundText: 'We could not find this page. It may have been moved, or the address has a typo.',
  NotFoundBackText: 'Let\u2019s get you back to the places to stay.',
  BackToMain: 'Back to main page',
  FavoritesTitle: 'Saved listing',
  PhotosLabel: 'Photos',
  Photo: 'photo',
  BookingLabel: 'Booking',
  GoodsTitle: 'What\u2019s inside',
  HostTitle: 'Meet the host',
  Pro: 'Pro',
  Bedroom: 'Bedroom',
  Bedrooms: 'Bedrooms',
  MaxAdultsPrefix: 'Max',
  Adult: 'adult',
  Adults: 'adults',
  ReviewsTitle: 'Reviews \u00b7',
  ReviewLoginSuffix: 'to leave a review',
  YourReview: 'Your review',
  YourRating: 'Your rating',
  ReviewTextLabel: 'Review text',
  ReviewPlaceholder: 'Tell how was your stay, what you like and what can be improved',
  ReviewHint: 'To submit review please make sure to set rating and describe your stay with at least',
  ReviewHintMin: `${String(ReviewLength.Min)} characters`,
  Submit: 'Submit',
  NearMapLabel: 'Map of places nearby',
  NearPlacesTitle: 'Other places in the neighbourhood',
  Loading: 'Loading\u2026',
  ServerErrorTitle: 'Server is unavailable',
  ServerErrorText: 'We could not load the data. Check your connection and try again in a minute.',
  TryAgain: 'Try again',
} as const;

// Заголовки вкладок (course/TASKS.md, M4): префикс и названия страниц без данных.
// Город и название предложения приходят из данных страницы.
export const PageTitle = {
  Prefix: 'Six Cities - ',
  Favorites: 'Favorites',
  Login: 'Login',
  NotFound: '404',
} as const;
