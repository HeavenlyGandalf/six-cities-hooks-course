import {render, screen} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import NotFoundPage from './not-found-page';

describe('NotFoundPage', () => {
  it('shows 404 Not Found and a link back to the main page', () => {
    const {container} = render(<NotFoundPage />);

    expect(screen.getByRole('heading', {level: 1})).toHaveTextContent('404 Not Found');
    expect(screen.getByRole('link', {name: 'Back to main page'})).toHaveAttribute('href', '/');
    expect(container.querySelector('svg.not-found__image')).toHaveAttribute('aria-hidden', 'true');
  });

  it('shows the signed-in user in the header', () => {
    render(<NotFoundPage />);

    expect(screen.getByRole('link', {name: 'Sign out'})).toBeInTheDocument();
  });
});
