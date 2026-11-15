import {describe, expect, it} from 'vitest';
import {BREAKPOINTS} from '../const';

interface MediaCondition {
  file: string;
  condition: string;
}

interface MediaWidth {
  file: string;
  width: number;
}

// Текст стилей как строка: ?raw отдаёт содержимое, test.css.include в vite.config.ts не даёт Vitest его обнулить.
// Берётся весь CSS под src, чтобы будущие стили компонентов тоже проверялись.
const stylesheets = import.meta.glob<string>('/src/**/*.css', {
  query: '?raw',
  import: 'default',
  eager: true,
});

// Условие правила: от @media до открывающей скобки блока. Тело правила не берётся.
const MEDIA_CONDITION_PATTERN = /@media[^{]*\{/g;
const WIDTH_FEATURE_PATTERN = /\(\s*(?:min|max)-width\s*:\s*(\d+)px\s*\)/g;
const WIDTH_MENTION = 'width';

const knownWidths = new Set<number>(Object.values(BREAKPOINTS));

const collectMediaConditions = (file: string, css: string): MediaCondition[] =>
  Array.from(css.matchAll(MEDIA_CONDITION_PATTERN)).map(([condition]) => ({file, condition}));

const parseWidths = (condition: string): number[] =>
  Array.from(condition.matchAll(WIDTH_FEATURE_PATTERN)).map(([, width]) => Number(width));

const files = Object.entries(stylesheets);
const mediaConditions = files.flatMap(([file, css]) => collectMediaConditions(file, css));
const mediaWidths: MediaWidth[] = mediaConditions.flatMap(({file, condition}) =>
  parseWidths(condition).map((width) => ({file, width})),
);

describe('@media widths in src', () => {
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

  it('parses a width from every @media condition that mentions width', () => {
    const unparsedConditions = mediaConditions.filter(
      ({condition}) => condition.includes(WIDTH_MENTION) && parseWidths(condition).length === 0,
    );

    expect(unparsedConditions).toEqual([]);
  });

  it('uses only widths from BREAKPOINTS', () => {
    const unknownWidths = mediaWidths.filter(({width}) => !knownWidths.has(width));

    expect(unknownWidths).toEqual([]);
  });
});
