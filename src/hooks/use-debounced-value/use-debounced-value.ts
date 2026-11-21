import {useEffect, useState} from 'react';

// Возвращает value, но с отставанием: новое значение появляется только через delay мс
// после последнего изменения. Каждое изменение value или delay перезапускает таймер.
export function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Старый таймер снимается при новом value и при размонтировании.
    return () => {
      clearTimeout(timerId);
    };
  }, [value, delay]);

  return debouncedValue;
}
