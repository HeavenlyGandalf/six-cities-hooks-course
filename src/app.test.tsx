import {render, screen} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import App from './app';
import {APP_TITLE} from './const';

describe('App', () => {
  it('renders the application title', () => {
    render(<App />);

    expect(screen.getByRole('heading', {name: APP_TITLE})).toBeInTheDocument();
  });
});
