import {screen} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import {renderWithRouter} from '../../mocks/render-with-router';
import Footer from './footer';

describe('Footer', () => {
  it('renders the logo link and the project note', () => {
    renderWithRouter(<Footer />);

    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getByRole('link', {name: 'Шесть городов - на главную'})).toBeInTheDocument();
    expect(screen.getByText('Учебный проект')).toBeInTheDocument();
  });
});
