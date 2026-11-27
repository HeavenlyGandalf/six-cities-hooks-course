import {ESLint, type Linter} from 'eslint';
import hookSource from './use-yandex-map.ts?raw';
import {expect, it} from 'vitest';

const HOOK_PATH = 'src/hooks/use-yandex-map/use-yandex-map.ts';

// Разрешаем конфигурацию один раз при загрузке модуля, вне таймера отдельных проверок.
// Typed rules и программа TypeScript здесь не запускаются.
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- ESLint документирует результат как flat config, но его API возвращает неточный тип.
const projectConfig: Linter.Config = await new ESLint().calculateConfigForFile(HOOK_PATH);
const eslint = new ESLint({
  overrideConfigFile: true,
  overrideConfig: [{plugins: projectConfig.plugins}],
});

async function lintDirectives(source: string) {
  const directives = source.match(/\/\*[\s\S]*?\*\/|\/\/[^\n]*/g)
    ?.filter((comment) => /eslint-(?:disable|enable)/.test(comment)) ?? [];
  const results = await eslint.lintText(directives.join('\n'));
  return results.flatMap((result) => result.messages);
}

it('uses only ESLint rules available in the locked course toolchain', async () => {
  expect(await lintDirectives(hookSource)).toEqual([]);
});

it('detects the unavailable rule referenced by the original map hook directives', async () => {
  const messages = await lintDirectives(
    '/* eslint-disable @typescript-eslint/no-unsafe-class-instance-assignment -- SDK layers implement YMapEntity. */',
  );
  expect(messages).toHaveLength(1);
  expect(messages[0]).toMatchObject({
    ruleId: '@typescript-eslint/no-unsafe-class-instance-assignment',
    severity: 2,
    message: "Definition for rule '@typescript-eslint/no-unsafe-class-instance-assignment' was not found.",
  });
});
