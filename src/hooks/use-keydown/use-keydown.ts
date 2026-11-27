import {useEffect, useLayoutEffect, useRef} from 'react';

export function useKeydown(key: string, handler: (event: KeyboardEvent) => void, isActive: boolean): void {
  const handlerRef = useRef(handler);
  useLayoutEffect(() => {
    handlerRef.current = handler;
  });

  useEffect(() => {
    if (!isActive) {
      return undefined;
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === key) {
        handlerRef.current(event);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [key, isActive]);
}
