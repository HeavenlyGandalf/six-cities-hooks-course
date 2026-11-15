import {render, screen} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import type {OfferPreview} from '../../types/offer';
import OffersList from './offers-list';

function createOffer(id: string, title: string): OfferPreview {
  return {
    id,
    title,
    type: 'room',
    price: 80,
    previewImage: '/img/offers/2.jpg',
    city: {name: 'Paris', location: {latitude: 0, longitude: 0, zoom: 13}},
    location: {latitude: 0, longitude: 0, zoom: 16},
    isFavorite: false,
    isPremium: false,
    rating: 3,
  };
}

describe('OffersList', () => {
  it('renders one card per offer', () => {
    const offers = [createOffer('a', 'First offer'), createOffer('b', 'Second offer'), createOffer('c', 'Third offer')];

    render(<OffersList offers={offers} />);

    expect(screen.getAllByRole('article')).toHaveLength(3);
    expect(screen.getByRole('link', {name: 'Second offer'})).toBeInTheDocument();
  });
});
