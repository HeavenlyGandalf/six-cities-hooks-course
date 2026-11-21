import {screen} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import {renderWithRouter} from '../../mocks/render-with-router';
import Logo from './logo';

describe('Logo', () => {
  it('links to the main page', () => {
    renderWithRouter(<Logo />);

    expect(screen.getByRole('link', {name: 'Шесть городов - на главную'})).toHaveAttribute('href', '/');
  });
});
