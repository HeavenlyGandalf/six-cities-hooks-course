import {screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Route, Routes} from 'react-router';
import {afterEach, describe, expect, it, vi} from 'vitest';
import {AppRoute} from '../../const';
import {fullOffers} from '../../mocks/offer';
import {offers} from '../../mocks/offers';
import {renderWithRouter} from '../../mocks/render-with-router';
import {reviews} from '../../mocks/reviews';
import OfferPage from './offer-page';

const [offer, secondOffer] = fullOffers;

// По умолчанию stubUser - настоящая заглушка (гость); отдельный тест подставляет вошедшего.
const userState = vi.hoisted(() => ({
  signedInUser: {
    name: 'Oliver',
    avatarUrl: '/img/avatars/user-3.svg',
    isPro: false,
    email: 'oliver@example.com',
    token: 'token',
  },
  isSignedIn: false,
}));

vi.mock('../../mocks/user', () => ({
  get stubUser() {
    return userState.isSignedIn ? userState.signedInUser : null;
  },
}));

// useParams читает id только внутри маршрута с шаблоном /offer/:id.
function renderOfferPage(id: string) {
  return renderWithRouter(
    <Routes>
      <Route path={AppRoute.OfferPattern} element={<OfferPage />} />
    </Routes>,
    {route: `${AppRoute.Offer}/${id}`},
  );
}

describe('OfferPage', () => {
  afterEach(() => {
    userState.isSignedIn = false;
  });

  it('puts the offer title into the tab title in <head>', () => {
    const {container} = renderOfferPage(offer.id);

    expect(document.title).toContain(offer.title);
    // document.title берёт первый <title> во всём документе; проверяем, что React поднял его из body в head.
    expect(container.querySelector('title')).toBeNull();
    expect(document.head.querySelector('title')).toHaveTextContent(offer.title);
  });

  it('shows no more than 6 photos of 7', () => {
    const {container} = renderOfferPage(offer.id);

    expect(offer.images).toHaveLength(7);
    expect(container.querySelectorAll('.gallery__item')).toHaveLength(6);
  });

  it('shows title, Premium, capitalized type, bedrooms and adults', () => {
    const {container} = renderOfferPage(offer.id);

    expect(screen.getByRole('heading', {level: 1, name: offer.title})).toBeInTheDocument();
    expect(container.querySelector('.offer__badge')).toHaveTextContent('Premium');
    expect(container.querySelector('.offer__feature--type')).toHaveTextContent('Apartment');
    expect(container.querySelector('.offer__feature--bedrooms')).toHaveTextContent('3 Bedrooms');
    expect(container.querySelector('.offer__feature--adults')).toHaveTextContent('Max 4 adults');
  });

  it('shows rating as rounded stars and the exact number', () => {
    const {container} = renderOfferPage(offer.id);

    expect(container.querySelector('.offer__rating-value')).toHaveTextContent('Rating 3.1');
    expect(container.querySelector('.rating--large .rating__fill')).toHaveStyle({'--rating': '60%'});
  });

  it('shows price, goods and the Pro host', () => {
    const {container} = renderOfferPage(offer.id);

    const booking = screen.getByRole('complementary', {name: 'Booking'});
    expect(within(booking).getByText('€120', {exact: false})).toBeInTheDocument();
    expect(container.querySelectorAll('.goods__item')).toHaveLength(offer.goods.length);
    expect(container.querySelector('.host')).toHaveClass('host--pro');
    expect(screen.getByText('Pro')).toHaveClass('host__status');
  });

  it('shows reviews with the total count and a sign in invite for a guest', () => {
    renderOfferPage(offer.id);

    const section = screen.getByRole('region', {name: `Reviews · ${String(reviews.length)}`});
    expect(within(section).getAllByRole('listitem')).toHaveLength(reviews.length);
    expect(within(section).getByRole('link', {name: 'Sign in'})).toHaveAttribute('href', '/login');
    expect(within(section).queryByRole('button', {name: 'Submit'})).not.toBeInTheDocument();
  });

  it('shows 3 nearby offers without the current one and a map placeholder', () => {
    renderOfferPage(offer.id);

    const near = screen.getByRole('region', {name: 'Other places in the neighbourhood'});
    const cards = within(near).getAllByRole('article');
    expect(cards).toHaveLength(3);
    within(near).getAllByRole('link').forEach((link) => {
      expect(link).not.toHaveAttribute('href', `/offer/${offer.id}`);
    });
    expect(within(screen.getByRole('region', {name: 'Map of places nearby'})).getByText('Здесь - Яндекс Карты'))
      .toBeInTheDocument();
  });

  it('does not highlight a nearby card on hover or focus', async () => {
    const user = userEvent.setup();
    renderOfferPage(offer.id);

    const near = screen.getByRole('region', {name: 'Other places in the neighbourhood'});
    const [firstCard] = within(near).getAllByRole('article');
    await user.hover(firstCard);
    await user.click(within(firstCard).getByRole('button'));

    expect(firstCard).not.toHaveClass('place-card--active');
    expect(near.querySelectorAll('.place-card--active')).toHaveLength(0);
  });

  it('shows the offer whose id is in the address', () => {
    renderOfferPage(secondOffer.id);

    expect(screen.getByRole('heading', {level: 1, name: secondOffer.title})).toBeInTheDocument();
    expect(document.title).toBe(`Six Cities - ${secondOffer.title}`);
  });

  it('shows the 404 page for an unknown id', () => {
    renderOfferPage('unknown');

    expect(screen.getByRole('heading', {level: 1})).toHaveTextContent('404 Not Found');
    expect(document.title).toBe('Six Cities - 404');
  });

  it('opens a nearby offer by its card title without leaving the page', async () => {
    const user = userEvent.setup();
    renderOfferPage(offer.id);

    const near = screen.getByRole('region', {name: 'Other places in the neighbourhood'});
    await user.click(within(near).getByRole('link', {name: secondOffer.title}));

    expect(screen.getByRole('heading', {level: 1, name: secondOffer.title})).toBeInTheDocument();
    expect(document.title).toBe(`Six Cities - ${secondOffer.title}`);
  });

  it('shows the review form to a signed-in user', () => {
    userState.isSignedIn = true;
    renderOfferPage(offer.id);

    const section = screen.getByRole('region', {name: `Reviews · ${String(reviews.length)}`});
    expect(within(section).getByRole('heading', {level: 3, name: 'Your review'})).toBeInTheDocument();
    expect(within(section).getByRole('button', {name: 'Submit'})).toBeDisabled();
    expect(within(section).queryByRole('link', {name: 'Sign in'})).not.toBeInTheDocument();
  });

  it.each(offers.map((preview) => [preview.title, preview.id]))('has a full offer for the card %s', (title, id) => {
    renderOfferPage(id);

    expect(screen.getByRole('heading', {level: 1, name: title})).toBeInTheDocument();
  });
});
