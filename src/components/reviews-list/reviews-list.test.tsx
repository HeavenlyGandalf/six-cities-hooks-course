import {render, screen} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import type {Review} from '../../types/review';
import ReviewsList from './reviews-list';

function createReview(id: string, name: string): Review {
  return {
    id,
    date: '2019-04-24T14:13:56.569Z',
    user: {name, avatarUrl: '/img/avatars/avatar-max.svg', isPro: false},
    comment: `Review by ${name}`,
    rating: 4,
  };
}

describe('ReviewsList', () => {
  it('renders one item per review in the given order', () => {
    render(<ReviewsList reviews={[createReview('1', 'Max'), createReview('2', 'Leon')]} />);

    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent('Max');
    expect(items[1]).toHaveTextContent('Leon');
  });
});
