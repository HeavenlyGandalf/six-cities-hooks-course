import {act, fireEvent, render, screen} from '@testing-library/react';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {DEBOUNCE_DELAY_MS} from '../../variant';
import SearchField from './search-field';

function getInput(): HTMLElement {
  return screen.getByRole('searchbox', {name: 'Search by title'});
}

describe('SearchField', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows what is typed right away', () => {
    render(<SearchField onSearch={vi.fn()} />);

    fireEvent.change(getInput(), {target: {value: 'house'}});

    expect(getInput()).toHaveValue('house');
  });

  it('reports the query only after the delay since the last input', () => {
    const onSearch = vi.fn();
    render(<SearchField onSearch={onSearch} />);

    fireEvent.change(getInput(), {target: {value: 'ho'}});
    act(() => {
      vi.advanceTimersByTime(DEBOUNCE_DELAY_MS - 1);
    });
    fireEvent.change(getInput(), {target: {value: 'house'}});
    act(() => {
      vi.advanceTimersByTime(DEBOUNCE_DELAY_MS - 1);
    });

    expect(onSearch).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(onSearch).toHaveBeenCalledTimes(1);
    expect(onSearch).toHaveBeenCalledWith('house');
  });

  it('reports the query right away on Enter', () => {
    const onSearch = vi.fn();
    render(<SearchField onSearch={onSearch} />);

    fireEvent.change(getInput(), {target: {value: 'house'}});
    fireEvent.keyDown(getInput(), {key: 'Enter'});

    expect(onSearch).toHaveBeenCalledTimes(1);
    expect(onSearch).toHaveBeenCalledWith('house');

    act(() => {
      vi.advanceTimersByTime(DEBOUNCE_DELAY_MS);
    });

    expect(onSearch).toHaveBeenCalledTimes(1);
  });

  it('cancels the pending query when the field is cleared', () => {
    const onSearch = vi.fn();
    render(<SearchField onSearch={onSearch} />);

    fireEvent.change(getInput(), {target: {value: 'house'}});
    fireEvent.change(getInput(), {target: {value: ''}});

    expect(onSearch).toHaveBeenCalledTimes(1);
    expect(onSearch).toHaveBeenCalledWith('');

    act(() => {
      vi.advanceTimersByTime(DEBOUNCE_DELAY_MS);
    });

    expect(onSearch).toHaveBeenCalledTimes(1);
  });
});
