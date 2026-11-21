import {screen, within} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import {renderWithRouter} from '../../mocks/render-with-router';
import {offers} from '../../mocks/offers';
import FavoritesPage from './favorites-page';

const favoriteOffers = offers.filter((offer) => offer.isFavorite);

describe('FavoritesPage', () => {
  it('shows the favorites count in the tab title', () => {
    renderWithRouter(<FavoritesPage />);

    expect(document.title).toBe(`Six Cities - Favorites (${String(favoriteOffers.length)})`);
  });

  it('shows only favorite offers as row cards', () => {
    renderWithRouter(<FavoritesPage />);

    const cards = screen.getAllByRole('article');
    expect(cards).toHaveLength(favoriteOffers.length);
    cards.forEach((card) => expect(card).toHaveClass('place-card--row'));
    offers
      .filter((offer) => !offer.isFavorite)
      .forEach((offer) => expect(screen.queryByRole('link', {name: offer.title})).not.toBeInTheDocument());
  });

  it('groups offers under a city heading linking to the main page', () => {
    renderWithRouter(<FavoritesPage />);

    const cityName = favoriteOffers[0].city.name;
    const section = screen.getByRole('region', {name: cityName});
    expect(within(section).getByRole('link', {name: cityName})).toHaveAttribute('href', '/');
    expect(within(section).getAllByRole('article')).toHaveLength(
      favoriteOffers.filter((offer) => offer.city.name === cityName).length,
    );
  });

  it('shows the favorites count in the header', () => {
    renderWithRouter(<FavoritesPage />);

    expect(screen.getByLabelText(`В избранном: ${String(favoriteOffers.length)}`)).toBeInTheDocument();
  });
});
