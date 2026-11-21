import {render, screen} from '@testing-library/react';
import {describe, expect, it, vi} from 'vitest';
import type {OfferPreview} from '../../types/offer';
import MainPage from './main-page';

const {fixtureOffers} = vi.hoisted(() => {
  const createOffer = (id: string, title: string, cityName: string): OfferPreview => ({
    id,
    title,
    type: 'apartment',
    price: 100,
    previewImage: '/img/offers/1.jpg',
    city: {name: cityName, location: {latitude: 0, longitude: 0, zoom: 13}},
    location: {latitude: 0, longitude: 0, zoom: 16},
    isFavorite: false,
    isPremium: false,
    rating: 4,
  });

  return {
    fixtureOffers: [
      createOffer('paris-1', 'Paris flat one', 'Paris'),
      createOffer('paris-2', 'Paris flat two', 'Paris'),
      createOffer('amsterdam-1', 'Amsterdam canal house', 'Amsterdam'),
    ],
  };
});

vi.mock('../../mocks/offers', () => ({offers: fixtureOffers}));

describe('MainPage', () => {
  it('puts the active city into the tab title', () => {
    render(<MainPage />);

    expect(document.title).toBe('Six Cities - Paris');
  });

  it('shows the number of places in the active city', () => {
    render(<MainPage />);

    expect(screen.getByRole('heading', {level: 2})).toHaveTextContent('2 places to stay in Paris');
  });

  it('renders cards only for offers of the active city', () => {
    render(<MainPage />);

    expect(screen.getAllByRole('article')).toHaveLength(2);
    expect(screen.getByText('Paris flat one')).toBeInTheDocument();
    expect(screen.queryByText('Amsterdam canal house')).not.toBeInTheDocument();
  });

  it('marks only the active city', () => {
    render(<MainPage />);

    const activeCity = screen.getByRole('link', {name: 'Paris'});
    expect(activeCity).toHaveClass('cities__link--active');
    expect(activeCity).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('navigation', {name: 'Cities'}).querySelectorAll('.cities__link--active')).toHaveLength(1);
  });
});
