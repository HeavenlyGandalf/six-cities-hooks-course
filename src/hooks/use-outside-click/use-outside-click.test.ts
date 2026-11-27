import {fireEvent, renderHook} from '@testing-library/react';
import {StrictMode} from 'react';
import {afterEach, describe, expect, it, vi} from 'vitest';
import {useOutsideClick} from './use-outside-click';

afterEach(() => vi.restoreAllMocks());

describe('useOutsideClick', () => {
  it('ignores inside, null ref and non-Node targets; calls outside with the latest handler', () => {
    const element = document.createElement('div');
    const child = element.appendChild(document.createElement('button'));
    const ref: {current: HTMLDivElement | null} = {current: element};
    const first = vi.fn();
    const latest = vi.fn();
    const add = vi.spyOn(document, 'addEventListener');
    const remove = vi.spyOn(document, 'removeEventListener');
    const {rerender, unmount} = renderHook(({handler, active}) => {
      useOutsideClick(ref, handler, active);
    }, {
      initialProps: {handler: first, active: false}, wrapper: StrictMode,
    });
    const subscriptions = () => add.mock.calls.filter(([type]) => type === 'mousedown');
    expect(subscriptions()).toHaveLength(0);
    fireEvent.mouseDown(document.body);
    expect(first).not.toHaveBeenCalled();
    rerender({handler: first, active: true});
    // Detached descendants still belong to the referenced menu.
    document.body.appendChild(element);
    fireEvent.mouseDown(child);
    fireEvent.mouseDown(element);
    const nonNodeEvent = new MouseEvent('mousedown');
    Object.defineProperty(nonNodeEvent, 'target', {value: window});
    document.dispatchEvent(nonNodeEvent);
    expect(first).not.toHaveBeenCalled();
    fireEvent.mouseDown(document.body);
    expect(first).toHaveBeenCalledTimes(1);
    const count = subscriptions().length;
    rerender({handler: latest, active: true});
    expect(subscriptions()).toHaveLength(count);
    fireEvent.mouseDown(document.body);
    expect(latest).toHaveBeenCalledTimes(1);
    ref.current = null;
    fireEvent.mouseDown(document.body);
    expect(latest).toHaveBeenCalledTimes(1);
    ref.current = element;
    rerender({handler: latest, active: false});
    fireEvent.mouseDown(document.body);
    expect(latest).toHaveBeenCalledTimes(1);
    rerender({handler: latest, active: true});
    unmount();
    fireEvent.mouseDown(document.body);
    expect(latest).toHaveBeenCalledTimes(1);
    expect(remove.mock.calls.filter(([type]) => type === 'mousedown')).toHaveLength(subscriptions().length);
    element.remove();
  });

  it('does not duplicate an initially active StrictMode subscription', () => {
    const handler = vi.fn();
    const ref = {current: document.createElement('div')};
    const {unmount} = renderHook(() => {
      useOutsideClick(ref, handler, true);
    }, {wrapper: StrictMode});
    fireEvent.mouseDown(document.body);
    expect(handler).toHaveBeenCalledTimes(1);
    unmount();
    fireEvent.mouseDown(document.body);
    expect(handler).toHaveBeenCalledTimes(1);
  });
});
