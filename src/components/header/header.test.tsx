import {render, screen} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
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
    render(<Header user={user} favoriteCount={7} />);

    expect(screen.getByText('test.user@example.com')).toBeInTheDocument();
    expect(screen.getByLabelText('В избранном: 7')).toHaveTextContent('7');
    expect(screen.getByRole('link', {name: 'Sign out'})).toBeInTheDocument();
    expect(screen.queryByRole('link', {name: 'Sign in'})).not.toBeInTheDocument();
  });

  it('shows a Sign in link to /login for a guest', () => {
    render(<Header user={null} favoriteCount={0} />);

    expect(screen.getByRole('link', {name: 'Sign in'})).toHaveAttribute('href', '/login');
    expect(screen.queryByRole('link', {name: 'Sign out'})).not.toBeInTheDocument();
  });
});
