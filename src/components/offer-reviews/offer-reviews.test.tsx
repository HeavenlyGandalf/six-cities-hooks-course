import {render, screen} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import type {Review} from '../../types/review';
import type {AuthInfo} from '../../types/user';
import OfferReviews from './offer-reviews';

const reviews: Review[] = [
  {
    id: '1',
    date: '2019-04-24T14:13:56.569Z',
    user: {name: 'Max', avatarUrl: '/img/avatars/avatar-max.svg', isPro: false},
    comment: 'Quiet and cozy.',
    rating: 4,
  },
  {
    id: '2',
    date: '2019-05-08T09:20:11.000Z',
    user: {name: 'Leon', avatarUrl: '/img/avatars/avatar-leon.svg', isPro: false},
    comment: 'Noisy street.',
    rating: 3,
  },
];

const user: AuthInfo = {
  name: 'Oliver',
  avatarUrl: '/img/avatars/user-3.svg',
  isPro: false,
  email: 'oliver@example.com',
  token: 'token',
};

describe('OfferReviews', () => {
  it('shows the total number of reviews in the heading', () => {
    render(<OfferReviews reviews={reviews} user={user} />);

    expect(screen.getByRole('heading', {level: 2})).toHaveTextContent('Reviews · 2');
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('shows the review form to a signed in user', () => {
    render(<OfferReviews reviews={reviews} user={user} />);

    expect(screen.getByRole('heading', {level: 3, name: 'Your review'})).toBeInTheDocument();
    expect(screen.queryByRole('link', {name: 'Sign in'})).not.toBeInTheDocument();
  });

  it('invites a guest to sign in instead of the form', () => {
    const {container} = render(<OfferReviews reviews={reviews} user={null} />);

    expect(screen.getByRole('link', {name: 'Sign in'})).toHaveAttribute('href', '/login');
    expect(container.querySelector('.reviews__login')).toHaveTextContent('Sign in to leave a review');
    expect(screen.queryByRole('heading', {name: 'Your review'})).not.toBeInTheDocument();
  });
});
