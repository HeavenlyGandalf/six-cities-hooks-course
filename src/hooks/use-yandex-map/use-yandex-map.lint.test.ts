import {ESLint} from 'eslint';
import {expect, it} from 'vitest';

it('uses only ESLint rules available in the locked course toolchain', async () => {
  const eslint = new ESLint();
  const results = await eslint.lintFiles(['src/hooks/use-yandex-map/use-yandex-map.ts']);
  expect(results.flatMap((result) => result.messages)).toEqual([]);
});
