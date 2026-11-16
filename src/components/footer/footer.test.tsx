import {render, screen} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import Footer from './footer';

describe('Footer', () => {
  it('renders the logo link and the project note', () => {
    render(<Footer />);

    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getByRole('link', {name: 'Шесть городов - на главную'})).toBeInTheDocument();
    expect(screen.getByText('Учебный проект')).toBeInTheDocument();
  });
});
