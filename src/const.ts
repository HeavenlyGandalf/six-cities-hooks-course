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
