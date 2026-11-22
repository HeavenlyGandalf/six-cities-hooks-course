import {act, fireEvent, render, screen} from '@testing-library/react';
import {useState, type JSX} from 'react';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {DEBOUNCE_DELAY_MS} from '../../variant';
import SearchField from './search-field';

function getInput(): HTMLElement {
  return screen.getByRole('searchbox', {name: 'Search by title'});
}

interface ControlledSearchFieldProps {
  onSearch: (query: string) => void;
  onValueChange?: (value: string) => void;
}

// Поле управляемое: набранный текст хранит родитель, как MainPage.
function ControlledSearchField({onSearch, onValueChange}: ControlledSearchFieldProps): JSX.Element {
  const [value, setValue] = useState('');
  const handleValueChange = (nextValue: string) => {
    setValue(nextValue);
    onValueChange?.(nextValue);
  };

  return <SearchField value={value} onValueChange={handleValueChange} onSearch={onSearch} />;
}

describe('SearchField', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows what is typed right away', () => {
    render(<ControlledSearchField onSearch={vi.fn()} />);

    fireEvent.change(getInput(), {target: {value: 'house'}});

    expect(getInput()).toHaveValue('house');
  });

  it('shows the value passed by the parent', () => {
    render(<SearchField value="canal" onValueChange={vi.fn()} onSearch={vi.fn()} />);

    expect(getInput()).toHaveValue('canal');
  });

  it('reports typed text to the parent right away', () => {
    const onValueChange = vi.fn();
    render(<ControlledSearchField onSearch={vi.fn()} onValueChange={onValueChange} />);

    fireEvent.change(getInput(), {target: {value: 'house'}});

    expect(onValueChange).toHaveBeenCalledWith('house');
  });

  it('reports the query only after the delay since the last input', () => {
    const onSearch = vi.fn();
    render(<ControlledSearchField onSearch={onSearch} />);

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
    render(<ControlledSearchField onSearch={onSearch} />);

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
    render(<ControlledSearchField onSearch={onSearch} />);

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
