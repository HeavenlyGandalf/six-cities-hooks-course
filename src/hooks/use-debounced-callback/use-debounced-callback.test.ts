import {act, renderHook} from '@testing-library/react';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {useDebouncedCallback} from './use-debounced-callback';

const DELAY = 300;

describe('useDebouncedCallback', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('does not call fn before the delay', () => {
    const fn = vi.fn<(query: string) => void>();
    const {result} = renderHook(() => useDebouncedCallback(fn, DELAY));

    act(() => {
      result.current('a');
      vi.advanceTimersByTime(DELAY - 1);
    });

    expect(fn).not.toHaveBeenCalled();
  });

  it('calls fn once with the last arguments after the delay', () => {
    const fn = vi.fn<(query: string) => void>();
    const {result} = renderHook(() => useDebouncedCallback(fn, DELAY));

    act(() => {
      result.current('a');
      vi.advanceTimersByTime(DELAY);
    });

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('a');
  });

  it('restarts the timer on each call', () => {
    const fn = vi.fn<(query: string) => void>();
    const {result} = renderHook(() => useDebouncedCallback(fn, DELAY));

    act(() => {
      result.current('a');
      vi.advanceTimersByTime(DELAY - 1);
      result.current('ab');
      vi.advanceTimersByTime(DELAY - 1);
    });

    expect(fn).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('ab');
  });

  it('flush calls the pending fn right away and only once', () => {
    const fn = vi.fn<(query: string) => void>();
    const {result} = renderHook(() => useDebouncedCallback(fn, DELAY));

    act(() => {
      result.current('a');
      result.current.flush();
    });

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('a');

    act(() => {
      vi.advanceTimersByTime(DELAY);
    });

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('flush without a pending call does nothing', () => {
    const fn = vi.fn<(query: string) => void>();
    const {result} = renderHook(() => useDebouncedCallback(fn, DELAY));

    act(() => {
      result.current.flush();
    });

    expect(fn).not.toHaveBeenCalled();
  });

  it('cancel drops the pending call', () => {
    const fn = vi.fn<(query: string) => void>();
    const {result} = renderHook(() => useDebouncedCallback(fn, DELAY));

    act(() => {
      result.current('a');
      result.current.cancel();
      vi.advanceTimersByTime(DELAY);
      result.current.flush();
    });

    expect(fn).not.toHaveBeenCalled();
  });

  it('does not call fn after unmount', () => {
    const fn = vi.fn<(query: string) => void>();
    const {result, unmount} = renderHook(() => useDebouncedCallback(fn, DELAY));

    act(() => {
      result.current('a');
    });
    unmount();
    vi.advanceTimersByTime(DELAY);

    expect(fn).not.toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('calls the latest fn if it changed while waiting', () => {
    const firstFn = vi.fn<(query: string) => void>();
    const secondFn = vi.fn<(query: string) => void>();
    const {result, rerender} = renderHook(({fn}) => useDebouncedCallback(fn, DELAY), {
      initialProps: {fn: firstFn},
    });

    act(() => {
      result.current('a');
    });
    rerender({fn: secondFn});
    act(() => {
      vi.advanceTimersByTime(DELAY);
    });

    expect(firstFn).not.toHaveBeenCalled();
    expect(secondFn).toHaveBeenCalledWith('a');
  });

  it('flush calls the latest fn too', () => {
    const firstFn = vi.fn<(query: string) => void>();
    const secondFn = vi.fn<(query: string) => void>();
    const {result, rerender} = renderHook(({fn}) => useDebouncedCallback(fn, DELAY), {
      initialProps: {fn: firstFn},
    });

    act(() => {
      result.current('a');
    });
    rerender({fn: secondFn});
    act(() => {
      result.current.flush();
    });

    expect(firstFn).not.toHaveBeenCalled();
    expect(secondFn).toHaveBeenCalledWith('a');
  });

  it('returns the same function between renders', () => {
    const {result, rerender} = renderHook(({fn}) => useDebouncedCallback(fn, DELAY), {
      initialProps: {fn: vi.fn<(query: string) => void>()},
    });
    const first = result.current;

    rerender({fn: vi.fn<(query: string) => void>()});

    expect(result.current).toBe(first);
  });
});
