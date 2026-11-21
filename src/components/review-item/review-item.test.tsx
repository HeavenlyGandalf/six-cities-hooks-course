import {render, screen} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import type {Review} from '../../types/review';
import ReviewItem from './review-item';

const review: Review = {
  id: 'review-1',
  date: '2019-04-30T23:30:00Z',
  user: {name: 'Max', avatarUrl: '/img/avatars/avatar-max.svg', isPro: false},
  comment: 'Quiet and cozy.',
  rating: 4,
};

function renderReview() {
  return render(<ul><ReviewItem review={review} /></ul>);
}

describe('ReviewItem', () => {
  it('shows avatar, name, text and stars', () => {
    const {container} = renderReview();

    expect(container.querySelector('.review__avatar')).toHaveAttribute('src', '/img/avatars/avatar-max.svg');
    expect(screen.getByText('Max')).toHaveClass('review__name');
    expect(screen.getByText('Quiet and cozy.')).toHaveClass('review__text');
    expect(screen.getByLabelText('Rating 4 of 5').firstElementChild).toHaveStyle({'--rating': '80%'});
  });

  it('shows the date in UTC as month and year', () => {
    renderReview();

    const time = screen.getByText('April 2019');
    expect(time.tagName).toBe('TIME');
    expect(time).toHaveAttribute('datetime', '2019-04-30');
  });
});
