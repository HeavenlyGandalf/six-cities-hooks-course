import {useCallback, useLayoutEffect, useRef, useState} from 'react';

export type Validate<T> = (value: unknown) => value is T;

export type PersistentState<T> = [
  value: T,
  // Новое значение: сразу в состояние и в localStorage.
  setValue: (value: T) => void,
  // Удаляет ключ из localStorage и возвращает initialValue.
  remove: () => void,
];

function parseValue<T>(raw: string, fallback: T, validate: Validate<T>): T {
  try {
    const parsed: unknown = JSON.parse(raw);
    return validate(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

// Значение под key или fallback, если ключа нет, JSON битый, форма не та
// или хранилище недоступно (приватный режим может бросить исключение уже на чтении).
function readValue<T>(key: string, fallback: T, validate: Validate<T>): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) {
      return fallback;
    }
    return parseValue(raw, fallback, validate);
  } catch {
    return fallback;
  }
}

// Состояние, которое переживает перезагрузку: хранится в localStorage под key в виде JSON.
// При смене key читается значение
// нового ключа, значение старого с собой не переносится.
export function usePersistentState<T>(
  key: string,
  initialValue: T,
  validate: Validate<T>,
): PersistentState<T> {
  // Ленивая инициализация: localStorage читается и JSON разбирается только при монтировании.
  const [state, setState] = useState(() => ({key, value: readValue(key, initialValue, validate)}));

  // initialValue и validate часто создаются заново на каждом рендере. В ref они не попадают
  // в зависимости колбэков.
  const initialValueRef = useRef(initialValue);
  const validateRef = useRef(validate);

  useLayoutEffect(() => {
    initialValueRef.current = initialValue;
    validateRef.current = validate;
  });

  // Сменился key: значение читается заново во время рендера, чтобы ни один кадр
  // не показал значение старого ключа под новым.
  let value = state.value;
  if (state.key !== key) {
    value = readValue(key, initialValue, validate);
    setState({key, value});
  }

  const setValue = useCallback((next: T) => {
    setState({key, value: next});
    try {
      localStorage.setItem(key, JSON.stringify(next));
    } catch {
      // Хранилище переполнено или недоступно: значение остаётся в состоянии до перезагрузки.
    }
  }, [key]);

  const remove = useCallback(() => {
    setState({key, value: initialValueRef.current});
    try {
      localStorage.removeItem(key);
    } catch {
      // Хранилище недоступно: удалять нечего.
    }
  }, [key]);

  return [value, setValue, remove];
}
