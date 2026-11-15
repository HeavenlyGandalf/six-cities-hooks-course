import {render, screen} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import Logo from './logo';

describe('Logo', () => {
  it('links to the main page', () => {
    render(<Logo />);

    expect(screen.getByRole('link', {name: 'Шесть городов - на главную'})).toHaveAttribute('href', '/');
  });
});
