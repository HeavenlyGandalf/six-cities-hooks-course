import {useEffect, useLayoutEffect, useMemo, useRef} from 'react';

type TimerId = ReturnType<typeof setTimeout>;

export type DebouncedFunction<Args extends unknown[]> = ((...args: Args) => void) & {
  // Снимает ожидающий вызов: fn не будет вызвана.
  cancel: () => void;
  // Выполняет ожидающий вызов сразу. Если ожидающего вызова нет, ничего не делает.
  flush: () => void;
};

// Откладывает вызов fn на delay мс после последнего вызова. Возвращает одну и ту же функцию
// на всё время жизни компонента. fn и delay лежат в ref, поэтому срабатывает всегда
// последняя версия fn, даже если она поменялась во время ожидания.
export function useDebouncedCallback<Args extends unknown[]>(
  fn: (...args: Args) => void,
  delay: number,
): DebouncedFunction<Args> {
  const fnRef = useRef(fn);
  const delayRef = useRef(delay);
  const timerIdRef = useRef<TimerId | null>(null);
  // Аргументы ожидающего вызова. null - ничего не ждёт.
  const pendingArgsRef = useRef<Args | null>(null);

  // Ref обновляется после рендера, а не во время него: рендер должен оставаться чистым.
  useLayoutEffect(() => {
    fnRef.current = fn;
    delayRef.current = delay;
  });

  const debounced = useMemo(() => {
    const clearTimer = () => {
      if (timerIdRef.current !== null) {
        clearTimeout(timerIdRef.current);
        timerIdRef.current = null;
      }
    };

    const cancel = () => {
      clearTimer();
      pendingArgsRef.current = null;
    };

    const flush = () => {
      const args = pendingArgsRef.current;
      cancel();
      if (args !== null) {
        fnRef.current(...args);
      }
    };

    const call = (...args: Args) => {
      clearTimer();
      pendingArgsRef.current = args;
      timerIdRef.current = setTimeout(flush, delayRef.current);
    };

    // Свойства на самой функции: TypeScript выводит для call тип с cancel и flush без приведения.
    call.cancel = cancel;
    call.flush = flush;
    return call;
  }, []);

  // После размонтирования отложенный вызов не срабатывает.
  useEffect(() => debounced.cancel, [debounced]);

  return debounced;
}
