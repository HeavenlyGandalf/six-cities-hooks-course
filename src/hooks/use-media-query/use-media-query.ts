import {useCallback, useSyncExternalStore} from 'react';

// Подходит ли экран под медиазапрос. Значение читается из window.matchMedia прямо при рендере,
// поэтому первый рендер уже верный, а обновление приходит по событию change, без resize.
export function useMediaQuery(query: string): boolean {
  // Новая subscribe при смене query: React снимает слушатель со старого запроса и подписывается на новый.
  const subscribe = useCallback((onChange: () => void) => {
    const list = window.matchMedia(query);
    list.addEventListener('change', onChange);
    return () => {
      list.removeEventListener('change', onChange);
    };
  }, [query]);

  // Снимок - boolean: React сравнивает снимки по значению, лишних рендеров нет.
  const getSnapshot = () => window.matchMedia(query).matches;

  return useSyncExternalStore(subscribe, getSnapshot);
}
