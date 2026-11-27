import {act, fireEvent, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {StrictMode} from 'react';
import {describe, expect, it, vi} from 'vitest';
import {DEFAULT_SORT, SORT_OPTIONS, SortType} from '../../const';
import SortMenu from './sort-menu';

describe('SortMenu', () => {
  it('toggles the trigger, ignores inside clicks and closes outside without selecting', async () => {
    const user = userEvent.setup();
    const onSortChange = vi.fn();
    render(<SortMenu sort={DEFAULT_SORT} onSortChange={onSortChange} />);
    const trigger = screen.getByRole('button');
    await user.click(trigger);
    expect(screen.getByRole('option', {name: DEFAULT_SORT})).toHaveClass('sort__option--focused');
    fireEvent.mouseDown(screen.getByRole('listbox'));
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await user.click(trigger);
    fireEvent.mouseDown(document.body);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(onSortChange).not.toHaveBeenCalled();
  });

  it('moves focus around both boundaries without selecting, then confirms Enter', async () => {
    const user = userEvent.setup();
    const onSortChange = vi.fn();
    render(<StrictMode><SortMenu sort={DEFAULT_SORT} onSortChange={onSortChange} /></StrictMode>);
    const trigger = screen.getByRole('button');
    await user.click(trigger);
    const up = new KeyboardEvent('keydown', {key: 'ArrowUp', bubbles: true, cancelable: true});
    act(() => {
      document.dispatchEvent(up);
    });
    expect(up.defaultPrevented).toBe(true);
    const last = screen.getByRole('option', {name: SortType.RatingDescending});
    expect(last).toHaveFocus();
    expect(last).toHaveClass('sort__option--focused');
    expect(last).toHaveAttribute('aria-selected', 'false');
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('option', {name: DEFAULT_SORT})).toHaveFocus();
    await user.keyboard('{ArrowDown}{Enter}');
    expect(onSortChange).toHaveBeenCalledExactlyOnceWith(SortType.PriceAscending);
    expect(trigger).toHaveFocus();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('closes with Escape, reopens at the selected option and preserves Space and click selection', async () => {
    const user = userEvent.setup();
    const onSortChange = vi.fn();
    render(<SortMenu sort={SortType.PriceDescending} onSortChange={onSortChange} />);
    const trigger = screen.getByRole('button');
    await user.click(trigger);
    await user.keyboard('{ArrowDown}{Escape}');
    expect(trigger).toHaveFocus();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(onSortChange).not.toHaveBeenCalled();
    await user.keyboard('{ArrowDown}{Enter}');
    expect(onSortChange).not.toHaveBeenCalled();
    // Enter on the closed native button opens it; opening highlights the selected value.
    expect(screen.getByRole('option', {name: SortType.PriceDescending})).toHaveClass('sort__option--focused');
    const option = screen.getByRole('option', {name: SortType.PriceDescending});
    option.focus();
    await user.keyboard(' ');
    expect(onSortChange).toHaveBeenLastCalledWith(SortType.PriceDescending);
    expect(trigger).toHaveFocus();
    await user.click(trigger);
    await user.click(screen.getByRole('option', {name: SORT_OPTIONS[0]}));
    expect(onSortChange).toHaveBeenLastCalledWith(DEFAULT_SORT);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('uses updated props while open and removes subscriptions on unmount', async () => {
    const user = userEvent.setup();
    const first = vi.fn();
    const latest = vi.fn();
    const remove = vi.spyOn(document, 'removeEventListener');
    const {rerender, unmount} = render(<SortMenu sort={DEFAULT_SORT} onSortChange={first} />);
    await user.click(screen.getByRole('button'));
    rerender(<SortMenu sort={DEFAULT_SORT} onSortChange={latest} />);
    await user.keyboard('{ArrowDown}{Enter}');
    expect(first).not.toHaveBeenCalled();
    expect(latest).toHaveBeenCalledExactlyOnceWith(SortType.PriceAscending);
    await user.click(screen.getByRole('button'));
    remove.mockClear();
    unmount();
    expect(remove.mock.calls.filter(([type]) => type === 'mousedown')).toHaveLength(1);
    expect(remove.mock.calls.filter(([type]) => type === 'keydown')).toHaveLength(4);
    fireEvent.keyDown(document, {key: 'Enter'});
    expect(latest).toHaveBeenCalledTimes(1);
    remove.mockRestore();
  });
});
