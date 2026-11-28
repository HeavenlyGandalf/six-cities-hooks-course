import {useEffect, useEffectEvent, type RefObject} from 'react';

export function useOutsideClick<T extends HTMLElement>(
  ref: RefObject<T | null>,
  handler: (event: MouseEvent) => void,
  isActive: boolean,
): void {
  const onEvent = useEffectEvent(handler);

  useEffect(() => {
    if (!isActive) {
      return undefined;
    }
    const handleMouseDown = (event: MouseEvent) => {
      if (ref.current && event.target instanceof Node && !ref.current.contains(event.target)) {
        onEvent(event);
      }
    };
    document.addEventListener('mousedown', handleMouseDown);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [ref, isActive]);
}
