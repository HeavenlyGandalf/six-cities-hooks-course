import {act, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {describe, expect, it, vi} from 'vitest';
import {renderWithRouter} from '../../mocks/render-with-router';
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
    renderWithRouter(<MainPage />);

    expect(document.title).toBe('Six Cities - Paris');
  });

  it('shows the number of places in the active city', () => {
    renderWithRouter(<MainPage />);

    expect(screen.getByRole('heading', {level: 2})).toHaveTextContent('2 places to stay in Paris');
  });

  it('renders cards only for offers of the active city', () => {
    renderWithRouter(<MainPage />);

    expect(screen.getAllByRole('article')).toHaveLength(2);
    expect(screen.getByText('Paris flat one')).toBeInTheDocument();
    expect(screen.queryByText('Amsterdam canal house')).not.toBeInTheDocument();
  });

  it('marks only the active city', () => {
    renderWithRouter(<MainPage />);

    const activeCity = screen.getByRole('link', {name: 'Paris'});
    expect(activeCity).toHaveClass('cities__link--active');
    expect(activeCity).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('navigation', {name: 'Cities'}).querySelectorAll('.cities__link--active')).toHaveLength(1);
  });

  describe('active card', () => {
    function getActiveCards() {
      return document.querySelectorAll('.place-card--active');
    }

    it('has no active card initially', () => {
      renderWithRouter(<MainPage />);

      expect(getActiveCards()).toHaveLength(0);
    });

    it('makes the hovered card active and resets it on unhover', async () => {
      const user = userEvent.setup();
      renderWithRouter(<MainPage />);
      const [firstCard, secondCard] = screen.getAllByRole('article');

      await user.hover(firstCard);
      expect(firstCard).toHaveClass('place-card--active');
      expect(getActiveCards()).toHaveLength(1);

      await user.hover(secondCard);
      expect(secondCard).toHaveClass('place-card--active');
      expect(getActiveCards()).toHaveLength(1);

      await user.unhover(secondCard);
      expect(getActiveCards()).toHaveLength(0);
    });

    it('makes the card active when focus comes inside with Tab and resets it when focus leaves', async () => {
      const user = userEvent.setup();
      renderWithRouter(<MainPage />);
      const [firstCard, secondCard] = screen.getAllByRole('article');

      // Начинаем со ссылки первой карточки, чтобы не проходить Tab через шапку и фильтры.
      act(() => {
        screen.getByRole('link', {name: 'Paris flat one'}).focus();
      });
      expect(firstCard).toHaveClass('place-card--active');

      await user.tab();
      expect(secondCard).toHaveClass('place-card--active');
      expect(getActiveCards()).toHaveLength(1);

      await user.tab();
      expect(screen.getByRole('link', {name: 'Paris flat two'})).toHaveFocus();
      expect(secondCard).toHaveClass('place-card--active');

      await user.tab();
      expect(getActiveCards()).toHaveLength(0);
    });
  });
});
