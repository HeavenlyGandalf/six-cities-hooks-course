import {describe, expect, it} from 'vitest';
import {BREAKPOINTS} from '../const';

interface MediaWidth {
  file: string;
  width: number;
}

// Текст стилей как строка: ?raw отдаёт содержимое, test.css.include в vite.config.ts не даёт Vitest его обнулить.
const stylesheets = import.meta.glob<string>('./**/*.css', {
  query: '?raw',
  import: 'default',
  eager: true,
});

// Условие правила: от @media до открывающей скобки блока. Тело правила не берётся.
const MEDIA_CONDITION_PATTERN = /@media[^{]*\{/g;
const WIDTH_FEATURE_PATTERN = /\((?:min|max)-width:\s*(\d+)px\)/g;

const knownWidths = new Set<number>(Object.values(BREAKPOINTS));

const collectMediaWidths = (file: string, css: string): MediaWidth[] =>
  Array.from(css.matchAll(MEDIA_CONDITION_PATTERN)).flatMap(([condition]) =>
    Array.from(condition.matchAll(WIDTH_FEATURE_PATTERN)).map(([, width]) => ({
      file,
      width: Number(width),
    })),
  );

const files = Object.entries(stylesheets);
const mediaWidths = files.flatMap(([file, css]) => collectMediaWidths(file, css));

describe('@media widths in src/styles', () => {
  it('finds stylesheets', () => {
    expect(files.length).toBeGreaterThan(0);
  });

  it('reads every stylesheet as non-empty text', () => {
    const emptyFiles = files.filter(([, css]) => css.trim() === '').map(([file]) => file);

    expect(emptyFiles).toEqual([]);
  });

  it('finds widths in @media conditions', () => {
    expect(mediaWidths.length).toBeGreaterThan(0);
  });

  it('uses only widths from BREAKPOINTS', () => {
    const unknownWidths = mediaWidths.filter(({width}) => !knownWidths.has(width));

    expect(unknownWidths).toEqual([]);
  });
});
