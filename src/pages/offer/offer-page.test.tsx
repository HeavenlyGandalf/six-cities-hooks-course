import {screen, within} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import {renderWithRouter} from '../../mocks/render-with-router';
import {offer} from '../../mocks/offer';
import {reviews} from '../../mocks/reviews';
import OfferPage from './offer-page';

describe('OfferPage', () => {
  it('puts the offer title into the tab title in <head>', () => {
    const {container} = renderWithRouter(<OfferPage />);

    expect(document.title).toContain(offer.title);
    // document.title берёт первый <title> во всём документе; проверяем, что React поднял его из body в head.
    expect(container.querySelector('title')).toBeNull();
    expect(document.head.querySelector('title')).toHaveTextContent(offer.title);
  });

  it('shows no more than 6 photos of 7', () => {
    const {container} = renderWithRouter(<OfferPage />);

    expect(offer.images).toHaveLength(7);
    expect(container.querySelectorAll('.gallery__item')).toHaveLength(6);
  });

  it('shows title, Premium, capitalized type, bedrooms and adults', () => {
    const {container} = renderWithRouter(<OfferPage />);

    expect(screen.getByRole('heading', {level: 1, name: offer.title})).toBeInTheDocument();
    expect(container.querySelector('.offer__badge')).toHaveTextContent('Premium');
    expect(container.querySelector('.offer__feature--type')).toHaveTextContent('Apartment');
    expect(container.querySelector('.offer__feature--bedrooms')).toHaveTextContent('3 Bedrooms');
    expect(container.querySelector('.offer__feature--adults')).toHaveTextContent('Max 4 adults');
  });

  it('shows rating as rounded stars and the exact number', () => {
    const {container} = renderWithRouter(<OfferPage />);

    expect(container.querySelector('.offer__rating-value')).toHaveTextContent('Rating 4.8');
    expect(container.querySelector('.rating--large .rating__fill')).toHaveStyle({'--rating': '100%'});
  });

  it('shows price, goods and the Pro host', () => {
    const {container} = renderWithRouter(<OfferPage />);

    const booking = screen.getByRole('complementary', {name: 'Booking'});
    expect(within(booking).getByText('€120', {exact: false})).toBeInTheDocument();
    expect(container.querySelectorAll('.goods__item')).toHaveLength(offer.goods.length);
    expect(container.querySelector('.host')).toHaveClass('host--pro');
    expect(screen.getByText('Pro')).toHaveClass('host__status');
  });

  it('shows reviews with the total count and the form for a signed in user', () => {
    renderWithRouter(<OfferPage />);

    const section = screen.getByRole('region', {name: `Reviews · ${String(reviews.length)}`});
    expect(within(section).getAllByRole('listitem')).toHaveLength(reviews.length);
    expect(within(section).getByRole('button', {name: 'Submit'})).toBeDisabled();
  });

  it('shows 3 nearby offers without the current one and a map placeholder', () => {
    renderWithRouter(<OfferPage />);

    const near = screen.getByRole('region', {name: 'Other places in the neighbourhood'});
    const cards = within(near).getAllByRole('article');
    expect(cards).toHaveLength(3);
    within(near).getAllByRole('link').forEach((link) => {
      expect(link).not.toHaveAttribute('href', `/offer/${offer.id}`);
    });
    expect(within(screen.getByRole('region', {name: 'Map of places nearby'})).getByText('Здесь - Яндекс Карты'))
      .toBeInTheDocument();
  });
});
