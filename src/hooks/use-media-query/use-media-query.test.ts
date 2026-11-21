import {act, renderHook} from '@testing-library/react';
import {beforeEach, describe, expect, it} from 'vitest';
import {BREAKPOINTS, PHONE_MEDIA_QUERY} from '../../const';
import {getListenerCount, installMatchMedia, setWidth, TestWidth} from '../../mocks/match-media';
import {useMediaQuery} from './use-media-query';

const PHONE_QUERY = PHONE_MEDIA_QUERY;
const DESKTOP_QUERY = `(min-width: ${String(BREAKPOINTS.DESKTOP_MIN)}px)`;

describe('useMediaQuery', () => {
  beforeEach(() => {
    installMatchMedia(TestWidth.Phone);
  });

  it('returns the current match on the first render without a second render', () => {
    let renderCount = 0;
    const {result} = renderHook(() => {
      renderCount += 1;
      return useMediaQuery(PHONE_QUERY);
    });

    expect(result.current).toBe(true);
    expect(renderCount).toBe(1);
  });

  it('updates the value on the change event', () => {
    const {result} = renderHook(() => useMediaQuery(PHONE_QUERY));

    act(() => {
      setWidth(TestWidth.Tablet);
    });
    expect(result.current).toBe(false);

    act(() => {
      setWidth(TestWidth.Phone);
    });
    expect(result.current).toBe(true);
  });

  it('subscribes once and removes the change listener on unmount', () => {
    const {unmount} = renderHook(() => useMediaQuery(PHONE_QUERY));
    expect(getListenerCount(PHONE_QUERY)).toBe(1);

    unmount();

    expect(getListenerCount(PHONE_QUERY)).toBe(0);
  });

  it('switches to the new query and resubscribes when query changes', () => {
    const {result, rerender} = renderHook(({query}) => useMediaQuery(query), {
      initialProps: {query: PHONE_QUERY},
    });
    expect(result.current).toBe(true);

    rerender({query: DESKTOP_QUERY});

    expect(result.current).toBe(false);
    expect(getListenerCount(PHONE_QUERY)).toBe(0);
    expect(getListenerCount(DESKTOP_QUERY)).toBe(1);

    act(() => {
      setWidth(TestWidth.Desktop);
    });
    expect(result.current).toBe(true);
  });
});
