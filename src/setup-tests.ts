import '@testing-library/jest-dom/vitest';
import {cleanup} from '@testing-library/react';
import {afterEach} from 'vitest';

// Без globals: true RTL не подключает очистку сам, поэтому DOM чистится после каждого теста.
afterEach(() => {
  cleanup();
});
