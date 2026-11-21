import {act, renderHook} from '@testing-library/react';
import {afterEach, describe, expect, it, vi} from 'vitest';
import {usePersistentState} from './use-persistent-state';

interface Draft {
  text: string;
}

const KEY = 'test-draft-1';
const OTHER_KEY = 'test-draft-2';
const INITIAL: Draft = {text: ''};

function isDraft(value: unknown): value is Draft {
  return typeof value === 'object' && value !== null && 'text' in value && typeof value.text === 'string';
}

function renderPersistentState(key = KEY) {
  return renderHook(({storageKey}) => usePersistentState(storageKey, INITIAL, isDraft), {
    initialProps: {storageKey: key},
  });
}

// Событие storage, которое браузер присылает в эту вкладку, когда пишет другая.
function dispatchStorage(init: StorageEventInit) {
  act(() => {
    window.dispatchEvent(new StorageEvent('storage', {storageArea: localStorage, ...init}));
  });
}

afterEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe('usePersistentState: reading', () => {
  it('returns initialValue when nothing is stored', () => {
    const {result} = renderPersistentState();

    expect(result.current[0]).toEqual(INITIAL);
  });

  it('restores a stored value', () => {
    localStorage.setItem(KEY, JSON.stringify({text: 'saved'}));

    const {result} = renderPersistentState();

    expect(result.current[0]).toEqual({text: 'saved'});
  });

  it('returns initialValue for broken JSON', () => {
    localStorage.setItem(KEY, '{text:');

    const {result} = renderPersistentState();

    expect(result.current[0]).toEqual(INITIAL);
  });

  it.each([
    ['a number', '42'],
    ['null', 'null'],
    ['an object without text', '{"rating":4}'],
    ['text of a wrong type', '{"text":5}'],
  ])('returns initialValue for %s', (_name, raw) => {
    localStorage.setItem(KEY, raw);

    const {result} = renderPersistentState();

    expect(result.current[0]).toEqual(INITIAL);
  });

  it('returns initialValue when the storage cannot be read', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('Access denied', 'SecurityError');
    });

    const {result} = renderPersistentState();

    expect(result.current[0]).toEqual(INITIAL);
  });

  it('reads the storage only on mount', () => {
    const getItem = vi.spyOn(Storage.prototype, 'getItem');
    const {rerender} = renderPersistentState();

    rerender({storageKey: KEY});
    rerender({storageKey: KEY});

    expect(getItem).toHaveBeenCalledTimes(1);
  });
});

describe('usePersistentState: writing', () => {
  it('updates the value and writes it as JSON', () => {
    const {result} = renderPersistentState();

    act(() => {
      result.current[1]({text: 'new'});
    });

    expect(result.current[0]).toEqual({text: 'new'});
    expect(localStorage.getItem(KEY)).toBe('{"text":"new"}');
  });

  it('keeps working when setItem throws', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Storage is full', 'QuotaExceededError');
    });
    const {result} = renderPersistentState();

    act(() => {
      result.current[1]({text: 'new'});
    });

    expect(result.current[0]).toEqual({text: 'new'});
  });

  it('remove deletes the key and returns initialValue', () => {
    localStorage.setItem(KEY, JSON.stringify({text: 'saved'}));
    const {result} = renderPersistentState();

    act(() => {
      result.current[2]();
    });

    expect(result.current[0]).toEqual(INITIAL);
    expect(localStorage.getItem(KEY)).toBeNull();
  });

  it('remove keeps working when removeItem throws', () => {
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
      throw new DOMException('Access denied', 'SecurityError');
    });
    const {result} = renderPersistentState();

    act(() => {
      result.current[1]({text: 'new'});
    });
    act(() => {
      result.current[2]();
    });

    expect(result.current[0]).toEqual(INITIAL);
  });
});

describe('usePersistentState: storage event', () => {
  it('picks up a value written in another tab', () => {
    const {result} = renderPersistentState();

    dispatchStorage({key: KEY, newValue: '{"text":"from another tab"}'});

    expect(result.current[0]).toEqual({text: 'from another tab'});
  });

  it('returns initialValue when another tab removes the key', () => {
    localStorage.setItem(KEY, JSON.stringify({text: 'saved'}));
    const {result} = renderPersistentState();

    dispatchStorage({key: KEY, newValue: null});

    expect(result.current[0]).toEqual(INITIAL);
  });

  it('returns initialValue when another tab clears the storage', () => {
    localStorage.setItem(KEY, JSON.stringify({text: 'saved'}));
    const {result} = renderPersistentState();

    dispatchStorage({key: null, newValue: null});

    expect(result.current[0]).toEqual(INITIAL);
  });

  it.each([
    ['broken JSON', '{text:'],
    ['a wrong shape', '{"text":5}'],
  ])('returns initialValue for %s from another tab', (_name, newValue) => {
    localStorage.setItem(KEY, JSON.stringify({text: 'saved'}));
    const {result} = renderPersistentState();

    dispatchStorage({key: KEY, newValue});

    expect(result.current[0]).toEqual(INITIAL);
  });

  it('ignores other keys and sessionStorage', () => {
    localStorage.setItem(KEY, JSON.stringify({text: 'saved'}));
    const {result} = renderPersistentState();

    dispatchStorage({key: OTHER_KEY, newValue: '{"text":"other"}'});
    dispatchStorage({key: KEY, newValue: '{"text":"session"}', storageArea: sessionStorage});

    expect(result.current[0]).toEqual({text: 'saved'});
  });

  it('stops listening after unmount', () => {
    const removeListener = vi.spyOn(window, 'removeEventListener');
    const {unmount} = renderPersistentState();

    unmount();

    expect(removeListener).toHaveBeenCalledWith('storage', expect.any(Function));
  });
});

describe('usePersistentState: key change', () => {
  it('reads the value of the new key instead of keeping the old one', () => {
    localStorage.setItem(KEY, JSON.stringify({text: 'first'}));
    localStorage.setItem(OTHER_KEY, JSON.stringify({text: 'second'}));
    const {result, rerender} = renderPersistentState();

    rerender({storageKey: OTHER_KEY});

    expect(result.current[0]).toEqual({text: 'second'});
  });

  it('does not carry the old value to a key with nothing stored', () => {
    const {result, rerender} = renderPersistentState();
    act(() => {
      result.current[1]({text: 'first'});
    });

    rerender({storageKey: OTHER_KEY});

    expect(result.current[0]).toEqual(INITIAL);
    expect(localStorage.getItem(OTHER_KEY)).toBeNull();
  });

  it('writes to the new key and leaves the old one untouched', () => {
    localStorage.setItem(KEY, JSON.stringify({text: 'first'}));
    const {result, rerender} = renderPersistentState();

    rerender({storageKey: OTHER_KEY});
    act(() => {
      result.current[1]({text: 'second'});
    });

    expect(localStorage.getItem(KEY)).toBe('{"text":"first"}');
    expect(localStorage.getItem(OTHER_KEY)).toBe('{"text":"second"}');
  });

  it('listens to the new key only', () => {
    const {result, rerender} = renderPersistentState();

    rerender({storageKey: OTHER_KEY});
    dispatchStorage({key: KEY, newValue: '{"text":"old key"}'});
    expect(result.current[0]).toEqual(INITIAL);

    dispatchStorage({key: OTHER_KEY, newValue: '{"text":"new key"}'});
    expect(result.current[0]).toEqual({text: 'new key'});
  });
});
