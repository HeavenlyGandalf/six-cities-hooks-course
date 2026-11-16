import {render, screen} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import {DEFAULT_CITY} from '../../const';
import App from './app';

describe('App', () => {
  it('renders the main page', () => {
    render(<App />);

    expect(screen.getByRole('heading', {level: 2})).toHaveTextContent(`places to stay in ${DEFAULT_CITY}`);
    expect(screen.getAllByRole('article').length).toBeGreaterThan(0);
  });
});
