import '@testing-library/jest-dom/vitest';
import {cleanup} from '@testing-library/react';
import {afterEach, beforeEach} from 'vitest';
import {installMatchMedia, TestWidth, uninstallMatchMedia} from './mocks/match-media';

// В jsdom нет matchMedia: каждый тест начинается с десктопной ширины, телефон тест задаёт сам.
beforeEach(() => {
  installMatchMedia(TestWidth.Desktop);
});

// Без globals: true RTL не подключает очистку сам, поэтому DOM чистится после каждого теста.
afterEach(() => {
  cleanup();
  uninstallMatchMedia();
});
