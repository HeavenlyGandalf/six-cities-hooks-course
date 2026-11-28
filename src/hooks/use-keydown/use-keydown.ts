import {useEffect, useEffectEvent} from 'react';

export function useKeydown(key: string, handler: (event: KeyboardEvent) => void, isActive: boolean): void {
  const onEvent = useEffectEvent(handler);

  useEffect(() => {
    if (!isActive) {
      return undefined;
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === key) {
        onEvent(event);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [key, isActive]);
}
