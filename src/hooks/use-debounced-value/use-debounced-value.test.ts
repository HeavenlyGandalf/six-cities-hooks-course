import {act, renderHook} from '@testing-library/react';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {useDebouncedValue} from './use-debounced-value';

const DELAY = 300;

describe('useDebouncedValue', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns the initial value right away', () => {
    const {result} = renderHook(() => useDebouncedValue('a', DELAY));

    expect(result.current).toBe('a');
  });

  it('does not change the value before the delay', () => {
    const {result, rerender} = renderHook(({value}) => useDebouncedValue(value, DELAY), {
      initialProps: {value: 'a'},
    });

    rerender({value: 'ab'});
    act(() => {
      vi.advanceTimersByTime(DELAY - 1);
    });

    expect(result.current).toBe('a');
  });

  it('changes the value after the delay', () => {
    const {result, rerender} = renderHook(({value}) => useDebouncedValue(value, DELAY), {
      initialProps: {value: 'a'},
    });

    rerender({value: 'ab'});
    act(() => {
      vi.advanceTimersByTime(DELAY);
    });

    expect(result.current).toBe('ab');
  });

  it('restarts the timer on each new value and keeps only the last one', () => {
    const {result, rerender} = renderHook(({value}) => useDebouncedValue(value, DELAY), {
      initialProps: {value: 'a'},
    });

    rerender({value: 'ab'});
    act(() => {
      vi.advanceTimersByTime(DELAY - 1);
    });
    rerender({value: 'abc'});
    act(() => {
      vi.advanceTimersByTime(DELAY - 1);
    });

    expect(result.current).toBe('a');

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(result.current).toBe('abc');
  });

  it('leaves no timer after unmount', () => {
    const {rerender, unmount} = renderHook(({value}) => useDebouncedValue(value, DELAY), {
      initialProps: {value: 'a'},
    });

    rerender({value: 'ab'});
    unmount();

    expect(vi.getTimerCount()).toBe(0);
  });
});
