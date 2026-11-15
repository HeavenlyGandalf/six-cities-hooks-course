import react from '@vitejs/plugin-react';
import {defineConfig} from 'vitest/config';

// https://vite.dev/config/
// https://vitest.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
    setupFiles: ['./src/setup-tests.ts'],
    // По умолчанию Vitest подменяет любой CSS пустой строкой. Текст нужен только импортам с ?raw.
    css: {
      include: [/\.css\?raw$/],
    },
  },
});
