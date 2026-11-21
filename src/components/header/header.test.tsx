import {screen} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import {renderWithRouter} from '../../mocks/render-with-router';
import type {AuthInfo} from '../../types/user';
import Header from './header';

const user: AuthInfo = {
  name: 'Test',
  avatarUrl: '/img/avatars/user-1.svg',
  isPro: false,
  email: 'test.user@example.com',
  token: 'test-token',
};

describe('Header', () => {
  it('shows email, favorites count and Sign out for a signed-in user', () => {
    renderWithRouter(<Header user={user} favoriteCount={7} />);

    expect(screen.getByText('test.user@example.com')).toBeInTheDocument();
    expect(screen.getByLabelText('В избранном: 7')).toHaveTextContent('7');
    expect(screen.getByText('test.user@example.com').closest('a')).toHaveAttribute('href', '/favorites');
    expect(screen.getByRole('link', {name: 'Sign out'})).toHaveAttribute('href', '/');
    expect(screen.queryByRole('link', {name: 'Sign in'})).not.toBeInTheDocument();
  });

  it('keeps the full email in the link title, because the visible email can be cut with an ellipsis', () => {
    renderWithRouter(<Header user={user} favoriteCount={0} />);

    expect(screen.getByText('test.user@example.com').closest('a')).toHaveAttribute('title', 'test.user@example.com');
  });

  it('shows a Sign in link to /login for a guest', () => {
    renderWithRouter(<Header user={null} favoriteCount={0} />);

    expect(screen.getByRole('link', {name: 'Sign in'})).toHaveAttribute('href', '/login');
    expect(screen.queryByRole('link', {name: 'Sign out'})).not.toBeInTheDocument();
    expect(screen.getByRole('link', {name: 'Sign in'})).not.toHaveAttribute('aria-current');
  });

  it('marks Sign in as the current page on the login page', () => {
    renderWithRouter(<Header user={null} favoriteCount={0} isSignInCurrent />);

    expect(screen.getByRole('link', {name: 'Sign in'})).toHaveAttribute('aria-current', 'page');
  });
});
