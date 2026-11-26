import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {YANDEX_MAPS_LANG, YANDEX_MAPS_URL} from '../const';

const selector = `script[src^="${YANDEX_MAPS_URL}"]`;

function getScript(): HTMLScriptElement {
  const script = document.head.querySelector(selector);
  if (!(script instanceof HTMLScriptElement)) {
    throw new Error('Map script missing');
  }
  return script;
}

describe('loadYandexMaps', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv('VITE_YANDEX_MAPS_KEY', 'test-key');
  });

  afterEach(() => {
    document.head.querySelectorAll(selector).forEach((script) => {
      script.remove();
    });
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('shares the script and waits for API readiness', async () => {
    const {loadYandexMaps} = await import('./yandex-maps');
    let finish!: () => void;
    const api = {ready: new Promise<void>((resolve) => {
      finish = resolve;
    })};
    vi.stubGlobal('ymaps3', api);
    const loaded = loadYandexMaps();
    expect(loadYandexMaps()).toBe(loaded);
    const script = getScript();
    expect(document.head.querySelectorAll(selector)).toHaveLength(1);
    const url = new URL(script.src);
    expect(url.searchParams.get('apikey')).toBe('test-key');
    expect(url.searchParams.get('lang')).toBe(YANDEX_MAPS_LANG);
    script.dispatchEvent(new Event('load'));
    const onLoaded = vi.fn();
    void loaded.then(onLoaded);
    await Promise.resolve();
    expect(onLoaded).not.toHaveBeenCalled();
    finish();
    await expect(loaded).resolves.toBe(api);
    expect(loadYandexMaps()).toBe(loaded);
  });

  it('rejects without injecting a script when the key is missing', async () => {
    vi.stubEnv('VITE_YANDEX_MAPS_KEY', '');
    const {loadYandexMaps} = await import('./yandex-maps');
    await expect(loadYandexMaps()).rejects.toThrow();
    expect(document.head.querySelector(selector)).toBeNull();
  });

  it('removes a failed script and retries on the next call', async () => {
    const {loadYandexMaps} = await import('./yandex-maps');
    const failed = loadYandexMaps();
    const first = getScript();
    first.dispatchEvent(new Event('error'));
    await expect(failed).rejects.toThrow();
    expect(first.isConnected).toBe(false);
    const api = {ready: Promise.resolve()};
    vi.stubGlobal('ymaps3', api);
    const retry = loadYandexMaps();
    getScript().dispatchEvent(new Event('load'));
    await expect(retry).resolves.toBe(api);
  });
});
