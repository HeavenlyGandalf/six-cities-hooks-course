import {useSearchParams} from 'react-router';

type UrlStateSetter<T> = (value: T, options?: {replace?: boolean}) => void;

// URL остаётся источником значения; запись меняет только один параметр.
export function useUrlState<T>(
  name: string,
  defaultValue: T,
  parse: (value: string) => T,
): readonly [T, UrlStateSetter<T>] {
  const [params, setParams] = useSearchParams();
  const rawValue = params.get(name);
  const value = rawValue === null ? defaultValue : parse(rawValue);
  const setValue: UrlStateSetter<T> = (nextValue, options) => {
    setParams((current) => {
      const next = new URLSearchParams(current);
      if (nextValue === defaultValue || String(nextValue) === '') {
        next.delete(name);
      } else {
        next.set(name, String(nextValue));
      }
      return next;
    }, options);
  };
  return [value, setValue];
}
