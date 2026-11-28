import {fireEvent, render, screen} from '@testing-library/react';
import {MemoryRouter, useLocation, useNavigate} from 'react-router';
import {describe, expect, it} from 'vitest';
import {useUrlState} from './use-url-state';

function Harness() {
  const [value, setValue] = useUrlState('page', 1, Number);
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <>
      <output aria-label="value">{value}</output>
      <output aria-label="url">{location.search}</output>
      <button
        type="button"
        onClick={() => {
          setValue(2);
        }}
      >push
      </button>
      <button
        type="button"
        onClick={() => {
          setValue(3, {replace: true});
        }}
      >replace
      </button>
      <button
        type="button"
        onClick={() => {
          setValue(1);
        }}
      >default
      </button>
      <button
        type="button"
        onClick={() => {
          void navigate(-1);
        }}
      >back
      </button>
      <button
        type="button"
        onClick={() => {
          void navigate(1);
        }}
      >forward
      </button>
    </>
  );
}

describe('useUrlState', () => {
  it('reads and parses parameters without rewriting the URL', () => {
    render(<MemoryRouter initialEntries={['/?page=7&other=keep']}><Harness /></MemoryRouter>);
    expect(screen.getByLabelText('value')).toHaveTextContent('7');
    expect(screen.getByLabelText('url')).toHaveTextContent('?page=7&other=keep');
  });

  it('defaults a missing parameter and preserves unknown parameters', () => {
    render(<MemoryRouter initialEntries={['/?other=keep']}><Harness /></MemoryRouter>);
    expect(screen.getByLabelText('value')).toHaveTextContent('1');
    fireEvent.click(screen.getByText('push'));
    expect(screen.getByLabelText('url')).toHaveTextContent('?other=keep&page=2');
    fireEvent.click(screen.getByText('default'));
    expect(screen.getByLabelText('url')).toHaveTextContent('?other=keep');
  });

  it('uses push by default and supports replace, back and forward', () => {
    render(<MemoryRouter initialEntries={['/?page=7']}><Harness /></MemoryRouter>);
    fireEvent.click(screen.getByText('push'));
    fireEvent.click(screen.getByText('replace'));
    expect(screen.getByLabelText('value')).toHaveTextContent('3');
    fireEvent.click(screen.getByText('back'));
    expect(screen.getByLabelText('value')).toHaveTextContent('7');
    fireEvent.click(screen.getByText('forward'));
    expect(screen.getByLabelText('value')).toHaveTextContent('3');
  });

  it('encodes Unicode, spaces and symbols and removes empty strings', () => {
    function TextHarness() {
      const [value, setValue] = useUrlState('q', 'default', (raw) => raw);
      const location = useLocation();
      return (
        <>
          <output>{location.search}</output>
          <input
            aria-label="query" value={value} onChange={(event) => {
              setValue(event.target.value);
            }}
          />
        </>
      );
    }
    render(<MemoryRouter initialEntries={['/?other=keep']}><TextHarness /></MemoryRouter>);
    fireEvent.change(screen.getByLabelText('query'), {target: {value: 'ёж & +'}});
    expect(screen.getByRole('status')).toHaveTextContent('?other=keep&q=%D1%91%D0%B6+%26+%2B');
    expect(screen.getByLabelText('query')).toHaveValue('ёж & +');
    fireEvent.change(screen.getByLabelText('query'), {target: {value: ''}});
    expect(screen.getByRole('status')).toHaveTextContent('?other=keep');
  });
});
