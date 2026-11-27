import {fireEvent, renderHook} from '@testing-library/react';
import {StrictMode} from 'react';
import {afterEach, describe, expect, it, vi} from 'vitest';
import {useKeydown} from './use-keydown';

afterEach(() => vi.restoreAllMocks());

describe('useKeydown', () => {
  it('filters keys, uses the latest handler without subscribing again and cleans up', () => {
    const first = vi.fn();
    const latest = vi.fn();
    const add = vi.spyOn(document, 'addEventListener');
    const remove = vi.spyOn(document, 'removeEventListener');
    const {rerender, unmount} = renderHook(({key, handler, active}) => {
      useKeydown(key, handler, active);
    }, {
      initialProps: {key: 'Escape', handler: first, active: false}, wrapper: StrictMode,
    });
    const subscriptions = () => add.mock.calls.filter(([type]) => type === 'keydown');
    expect(subscriptions()).toHaveLength(0);
    fireEvent.keyDown(document, {key: 'Escape'});
    expect(first).not.toHaveBeenCalled();
    rerender({key: 'Escape', handler: first, active: true});
    fireEvent.keyDown(document, {key: 'Enter'});
    expect(first).not.toHaveBeenCalled();
    fireEvent.keyDown(document, {key: 'Escape'});
    expect(first).toHaveBeenCalledTimes(1);
    const count = subscriptions().length;
    rerender({key: 'Escape', handler: latest, active: true});
    expect(subscriptions()).toHaveLength(count);
    fireEvent.keyDown(document, {key: 'Escape'});
    expect(latest).toHaveBeenCalledTimes(1);
    rerender({key: 'Enter', handler: latest, active: true});
    expect(subscriptions()).toHaveLength(count + 1);
    fireEvent.keyDown(document, {key: 'Escape'});
    expect(latest).toHaveBeenCalledTimes(1);
    fireEvent.keyDown(document, {key: 'Enter'});
    expect(latest).toHaveBeenCalledTimes(2);
    rerender({key: 'Enter', handler: latest, active: false});
    fireEvent.keyDown(document, {key: 'Enter'});
    expect(latest).toHaveBeenCalledTimes(2);
    rerender({key: 'Enter', handler: latest, active: true});
    unmount();
    fireEvent.keyDown(document, {key: 'Enter'});
    expect(latest).toHaveBeenCalledTimes(2);
    expect(remove.mock.calls.filter(([type]) => type === 'keydown')).toHaveLength(subscriptions().length);
  });

  it('does not duplicate an initially active StrictMode subscription', () => {
    const handler = vi.fn();
    const {unmount} = renderHook(() => {
      useKeydown('Escape', handler, true);
    }, {wrapper: StrictMode});
    fireEvent.keyDown(document, {key: 'Escape'});
    expect(handler).toHaveBeenCalledTimes(1);
    unmount();
    fireEvent.keyDown(document, {key: 'Escape'});
    expect(handler).toHaveBeenCalledTimes(1);
  });
});
