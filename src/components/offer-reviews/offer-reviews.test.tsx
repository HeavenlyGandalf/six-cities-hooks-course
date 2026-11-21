import {screen} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import {MAX_REVIEWS} from '../../const';
import {renderWithRouter} from '../../mocks/render-with-router';
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

// 12 отзывов за каждый месяц 2019 года (0 - январь), вперемешку по датам.
const shuffledMonths = [5, 0, 11, 3, 8, 1, 10, 6, 2, 9, 4, 7];
const manyReviews: Review[] = shuffledMonths.map((month) => ({
  id: `review-${String(month)}`,
  date: new Date(Date.UTC(2019, month, 15)).toISOString(),
  user: {name: `Author ${String(month)}`, avatarUrl: '/img/avatars/avatar-max.svg', isPro: false},
  comment: `Review for month ${String(month)}.`,
  rating: 4,
}));

describe('OfferReviews', () => {
  it('shows the total in the heading but no more than 10 reviews', () => {
    renderWithRouter(<OfferReviews offerId="1" reviews={manyReviews} user={null} />);

    expect(screen.getByRole('heading', {level: 2})).toHaveTextContent(`Reviews · ${String(shuffledMonths.length)}`);
    expect(screen.getAllByRole('listitem')).toHaveLength(MAX_REVIEWS);
  });

  it('shows newer reviews first with the date as April 2019', () => {
    const {container} = renderWithRouter(<OfferReviews offerId="1" reviews={manyReviews} user={null} />);

    const dates = Array.from(container.querySelectorAll('.review__date'), (date) => date.textContent);
    expect(dates).toEqual([
      'December 2019',
      'November 2019',
      'October 2019',
      'September 2019',
      'August 2019',
      'July 2019',
      'June 2019',
      'May 2019',
      'April 2019',
      'March 2019',
    ]);
    expect(container.querySelector('.review__date')).toHaveAttribute('datetime', '2019-12-15');
  });

  it('shows the total number of reviews in the heading', () => {
    renderWithRouter(<OfferReviews offerId="1" reviews={reviews} user={user} />);

    expect(screen.getByRole('heading', {level: 2})).toHaveTextContent('Reviews · 2');
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('shows the review form to a signed in user', () => {
    renderWithRouter(<OfferReviews offerId="1" reviews={reviews} user={user} />);

    expect(screen.getByRole('heading', {level: 3, name: 'Your review'})).toBeInTheDocument();
    expect(screen.queryByRole('link', {name: 'Sign in'})).not.toBeInTheDocument();
  });

  it('invites a guest to sign in instead of the form', () => {
    const {container} = renderWithRouter(<OfferReviews offerId="1" reviews={reviews} user={null} />);

    expect(screen.getByRole('link', {name: 'Sign in'})).toHaveAttribute('href', '/login');
    expect(container.querySelector('.reviews__login')).toHaveTextContent('Sign in to leave a review');
    expect(screen.queryByRole('heading', {name: 'Your review'})).not.toBeInTheDocument();
  });
});
