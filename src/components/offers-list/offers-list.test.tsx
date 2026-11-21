import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {describe, expect, it, vi} from 'vitest';
import {renderWithRouter} from '../../mocks/render-with-router';
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

    renderWithRouter(<OffersList offers={offers} />);

    expect(screen.getAllByRole('article')).toHaveLength(3);
    expect(screen.getByRole('link', {name: 'Second offer'})).toBeInTheDocument();
  });

  it('wraps cards in places-grid by default', () => {
    const {container} = renderWithRouter(<OffersList offers={[createOffer('a', 'First offer')]} />);

    expect(container.firstElementChild).toHaveClass('places-grid');
  });

  it('uses the given list class and card variant', () => {
    const {container} = renderWithRouter(
      <OffersList offers={[createOffer('a', 'First offer')]} className="favorites__places" variant="row" />,
    );

    expect(container.firstElementChild).toHaveClass('favorites__places');
    expect(container.firstElementChild).not.toHaveClass('places-grid');
    expect(screen.getByRole('article')).toHaveClass('place-card--row');
  });

  it('marks only the card with activeOfferId as active', () => {
    const offers = [createOffer('a', 'First offer'), createOffer('b', 'Second offer'), createOffer('c', 'Third offer')];

    renderWithRouter(<OffersList offers={offers} activeOfferId="b" />);

    const cards = screen.getAllByRole('article');
    expect(cards[1]).toHaveClass('place-card--active');
    expect(document.querySelectorAll('.place-card--active')).toHaveLength(1);
  });

  it('marks no card when activeOfferId is null', () => {
    renderWithRouter(<OffersList offers={[createOffer('a', 'First offer')]} activeOfferId={null} />);

    expect(screen.getByRole('article')).not.toHaveClass('place-card--active');
  });

  it('passes onCardHover to the cards', async () => {
    const user = userEvent.setup();
    const onCardHover = vi.fn();
    renderWithRouter(
      <OffersList offers={[createOffer('a', 'First offer'), createOffer('b', 'Second offer')]} onCardHover={onCardHover} />,
    );

    await user.hover(screen.getAllByRole('article')[1]);

    expect(onCardHover).toHaveBeenLastCalledWith('b');
  });
});
