import {UiText, YANDEX_MAPS_LANG, YANDEX_MAPS_URL} from '../const';

let pending: Promise<typeof ymaps3> | undefined;

export function loadYandexMaps(): Promise<typeof ymaps3> {
  if (pending) {
    return pending;
  }

  const key = import.meta.env.VITE_YANDEX_MAPS_KEY?.trim();
  if (!key) {
    return Promise.reject(new Error(UiText.MapUnavailable));
  }

  const url = new URL(YANDEX_MAPS_URL);
  url.searchParams.set('apikey', key);
  url.searchParams.set('lang', YANDEX_MAPS_LANG);
  const script = document.createElement('script');
  script.src = url.href;
  pending = new Promise<void>((resolve, reject) => {
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(UiText.MapUnavailable));
    document.head.append(script);
  }).then(async () => {
    await ymaps3.ready;
    return ymaps3;
  }).catch((error: unknown) => {
    script.remove();
    pending = undefined;
    throw error;
  });
  return pending;
}
