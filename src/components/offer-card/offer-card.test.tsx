import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {describe, expect, it, vi} from 'vitest';
import {renderWithRouter} from '../../mocks/render-with-router';
import type {OfferPreview} from '../../types/offer';
import OfferCard, {type OfferCardVariant} from './offer-card';

const baseOffer: OfferPreview = {
  id: 'test-offer-id',
  title: 'Test apartment',
  type: 'apartment',
  price: 120,
  previewImage: '/img/offers/1.jpg',
  city: {name: 'Paris', location: {latitude: 48.85661, longitude: 2.351499, zoom: 13}},
  location: {latitude: 48.8686, longitude: 2.3425, zoom: 16},
  isFavorite: false,
  isPremium: false,
  rating: 4,
};

function renderCard(override: Partial<OfferPreview> = {}, variant?: OfferCardVariant) {
  return renderWithRouter(<OfferCard offer={{...baseOffer, ...override}} variant={variant} />);
}

describe('OfferCard', () => {
  it('renders title as a link to the offer page, price and type', () => {
    const {container} = renderCard();

    expect(screen.getByRole('link', {name: 'Test apartment'})).toHaveAttribute('href', '/offer/test-offer-id');
    expect(container.querySelector('.place-card__price')).toHaveTextContent('€120 / night');
    expect(screen.getByText('apartment')).toHaveClass('place-card__type');
  });

  it('has no Premium badge for a regular offer', () => {
    renderCard({isPremium: false});

    expect(screen.queryByText('Premium')).not.toBeInTheDocument();
  });

  it('shows Premium badge for a premium offer', () => {
    renderCard({isPremium: true});

    expect(screen.getByText('Premium')).toHaveClass('place-card__badge');
  });

  it.each([
    [3.1, '60%', '3'],
    [4.5, '100%', '5'],
    [4, '80%', '4'],
  ])('rating %s fills %s of stars', (rating, width, stars) => {
    renderCard({rating});

    const ratingElement = screen.getByLabelText(`Rating ${stars} of 5`);
    const fill = ratingElement.querySelector('.rating__fill');
    expect(fill).toHaveStyle({'--rating': width});
  });

  it('marks a favorite offer bookmark as active', () => {
    renderCard({isFavorite: true});

    const bookmark = screen.getByRole('button', {name: 'Remove from favorites'});
    expect(bookmark).toHaveClass('bookmark--active');
    expect(bookmark).toHaveAttribute('aria-pressed', 'true');
  });

  it('keeps a regular offer bookmark inactive', () => {
    renderCard({isFavorite: false});

    const bookmark = screen.getByRole('button', {name: 'Add to favorites'});
    expect(bookmark).not.toHaveClass('bookmark--active');
    expect(bookmark).toHaveAttribute('aria-pressed', 'false');
  });

  it('renders a grid card with the bookmark inside the image wrapper by default', () => {
    const {container} = renderCard();

    expect(screen.getByRole('article')).not.toHaveClass('place-card--row');
    expect(container.querySelector('.place-card__image-wrapper .place-card__bookmark')).toBeInTheDocument();
  });

  it('renders a row card with the bookmark after the info block', () => {
    const {container} = renderCard({}, 'row');

    const article = screen.getByRole('article');
    expect(article).toHaveClass('place-card', 'place-card--row');
    expect(container.querySelector('.place-card__image-wrapper .place-card__bookmark')).not.toBeInTheDocument();
    expect(container.querySelector('.place-card__info + .place-card__bookmark')).toBeInTheDocument();
  });

  describe('active card', () => {
    // Кнопка снаружи нужна, чтобы увести фокус за пределы карточки.
    function renderInteractiveCard(onCardHover?: (offerId: string | null) => void) {
      return renderWithRouter(
        <>
          <OfferCard offer={baseOffer} onCardHover={onCardHover} />
          <button type="button">Outside</button>
        </>,
      );
    }

    it('reports its id on hover and null on unhover', async () => {
      const user = userEvent.setup();
      const onCardHover = vi.fn();
      renderInteractiveCard(onCardHover);

      await user.hover(screen.getByRole('article'));
      expect(onCardHover).toHaveBeenLastCalledWith('test-offer-id');

      await user.unhover(screen.getByRole('article'));
      expect(onCardHover).toHaveBeenLastCalledWith(null);
    });

    it('reports its id when focus comes inside with Tab', async () => {
      const user = userEvent.setup();
      const onCardHover = vi.fn();
      renderInteractiveCard(onCardHover);

      await user.tab();

      expect(screen.getByRole('button', {name: 'Add to favorites'})).toHaveFocus();
      expect(onCardHover).toHaveBeenLastCalledWith('test-offer-id');
    });

    it('stays active while focus moves inside the card', async () => {
      const user = userEvent.setup();
      const onCardHover = vi.fn();
      renderInteractiveCard(onCardHover);

      await user.tab();
      await user.tab();

      expect(screen.getByRole('link', {name: 'Test apartment'})).toHaveFocus();
      expect(onCardHover).not.toHaveBeenCalledWith(null);
    });

    it('reports null when focus leaves the card', async () => {
      const user = userEvent.setup();
      const onCardHover = vi.fn();
      renderInteractiveCard(onCardHover);

      await user.tab();
      await user.tab();
      await user.tab();

      expect(screen.getByRole('button', {name: 'Outside'})).toHaveFocus();
      expect(onCardHover).toHaveBeenLastCalledWith(null);
    });

    it('reports null when focus leaves to nowhere', async () => {
      const user = userEvent.setup();
      const onCardHover = vi.fn();
      renderInteractiveCard(onCardHover);

      await user.tab();
      screen.getByRole('button', {name: 'Add to favorites'}).blur();

      expect(onCardHover).toHaveBeenLastCalledWith(null);
    });

    it('has no place-card--active by default', () => {
      renderCard();

      expect(screen.getByRole('article')).not.toHaveClass('place-card--active');
    });

    it('gets place-card--active when active', () => {
      renderWithRouter(<OfferCard offer={baseOffer} variant="row" isActive />);

      expect(screen.getByRole('article')).toHaveClass('place-card', 'place-card--row', 'place-card--active');
    });

    it('works without the callback', async () => {
      const user = userEvent.setup();
      renderInteractiveCard();

      await user.hover(screen.getByRole('article'));
      await user.tab();
      await user.unhover(screen.getByRole('article'));
      await user.tab();
      await user.tab();

      expect(screen.getByRole('article')).not.toHaveClass('place-card--active');
    });
  });
});
