import {render, screen} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import {DEFAULT_CITY} from '../../const';
import {offers} from '../../mocks/offers';
import MainPage from './main-page';

const cityOffers = offers.filter((offer) => offer.city.name === DEFAULT_CITY);

describe('MainPage', () => {
  it('shows the number of places in the active city', () => {
    render(<MainPage />);

    expect(screen.getByRole('heading', {level: 2}))
      .toHaveTextContent(`${String(cityOffers.length)} places to stay in ${DEFAULT_CITY}`);
  });

  it('renders a card for every offer of the active city', () => {
    render(<MainPage />);

    expect(screen.getAllByRole('article')).toHaveLength(cityOffers.length);
  });

  it('marks only the active city', () => {
    render(<MainPage />);

    const activeCity = screen.getByRole('link', {name: DEFAULT_CITY});
    expect(activeCity).toHaveClass('cities__link--active');
    expect(activeCity).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('navigation', {name: 'Cities'}).querySelectorAll('.cities__link--active')).toHaveLength(1);
  });
});
