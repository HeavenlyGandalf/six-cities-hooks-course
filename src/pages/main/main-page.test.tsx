import {act, fireEvent, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, describe, expect, it, vi} from 'vitest';
import {SORT_OPTIONS, UiText} from '../../const';
import {installMatchMedia, setWidth, TestWidth} from '../../mocks/match-media';
import {renderWithRouter} from '../../mocks/render-with-router';
import type {OfferPreview} from '../../types/offer';
import {DEBOUNCE_DELAY_MS} from '../../variant';
import MainPage from './main-page';
import {CITY_CENTERS} from '../../mocks/cities';
import type {City} from '../../types/offer';

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
      {...createOffer('paris-1', 'Paris flat one', 'Paris'), price: 200, rating: 3},
      createOffer('paris-2', 'Paris flat two', 'Paris'),
      createOffer('amsterdam-1', 'Amsterdam canal house', 'Amsterdam'),
    ],
  };
});

const mapRender = vi.fn<(props: {city: City; offers: OfferPreview[]; activeOfferId: string | null}) => void>();
vi.mock('../../components/map/map', () => ({
  default: (props: {city: City; offers: OfferPreview[]; activeOfferId: string | null}) => {
    mapRender(props);
    return <div data-testid="map" />;
  },
}));

vi.mock('../../mocks/offers', () => ({offers: fixtureOffers, PARIS: fixtureOffers[0].city}));

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

    function focusLink(name: string) {
      act(() => {
        screen.getByRole('link', {name}).focus();
      });
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
      focusLink('Paris flat one');
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

  describe('list / map switch', () => {
    function getMap() {
      return document.querySelector('.places-layout__map');
    }

    function getList() {
      return document.querySelector('.places-layout__list');
    }

    function getSwitch() {
      return screen.queryByRole('radiogroup', {name: UiText.ViewLabel});
    }

    function resizeTo(width: number) {
      act(() => {
        setWidth(width);
      });
    }

    function renderOnPhone() {
      installMatchMedia(TestWidth.Phone);
      renderWithRouter(<MainPage />);
    }

    it('shows the switch and mounts only the list by default on a phone', () => {
      renderOnPhone();

      expect(getSwitch()).toBeInTheDocument();
      expect(screen.getByRole('radio', {name: UiText.ViewList})).toBeChecked();
      expect(getList()).toBeInTheDocument();
      expect(getMap()).not.toBeInTheDocument();
    });

    it('mounts only the map after choosing Map on a phone', async () => {
      const user = userEvent.setup();
      renderOnPhone();

      await user.click(screen.getByRole('radio', {name: UiText.ViewMap}));

      expect(screen.getByRole('radio', {name: UiText.ViewMap})).toBeChecked();
      expect(getMap()).toBeInTheDocument();
      expect(getList()).not.toBeInTheDocument();
    });

    it('hides the switch and shows both list and map after widening a phone to a tablet', () => {
      renderOnPhone();

      resizeTo(TestWidth.Tablet);

      expect(getSwitch()).not.toBeInTheDocument();
      expect(getList()).toBeInTheDocument();
      expect(getMap()).toBeInTheDocument();
    });

    it('keeps Map chosen after widening to a tablet and narrowing back to a phone', async () => {
      const user = userEvent.setup();
      renderOnPhone();
      await user.click(screen.getByRole('radio', {name: UiText.ViewMap}));

      resizeTo(TestWidth.Tablet);
      resizeTo(TestWidth.Phone);

      expect(screen.getByRole('radio', {name: UiText.ViewMap})).toBeChecked();
      expect(getMap()).toBeInTheDocument();
      expect(getList()).not.toBeInTheDocument();
    });

    it('mounts the list again and unmounts the map after Map and back to List on a phone', async () => {
      const user = userEvent.setup();
      renderOnPhone();

      await user.click(screen.getByRole('radio', {name: UiText.ViewMap}));
      await user.click(screen.getByRole('radio', {name: UiText.ViewList}));

      expect(screen.getByRole('radio', {name: UiText.ViewList})).toBeChecked();
      expect(getList()).toBeInTheDocument();
      expect(getMap()).not.toBeInTheDocument();
    });

    it('resets the active card when Map is chosen on a phone', async () => {
      const user = userEvent.setup();
      renderOnPhone();
      const [firstCard] = screen.getAllByRole('article');
      await user.hover(firstCard);
      expect(firstCard).toHaveClass('place-card--active');

      // fireEvent, а не user.click: user.click сам уводит курсор с карточки (mouseleave) и спрятал бы ошибку.
      fireEvent.click(screen.getByRole('radio', {name: UiText.ViewMap}));
      fireEvent.click(screen.getByRole('radio', {name: UiText.ViewList}));

      expect(document.querySelectorAll('.place-card--active')).toHaveLength(0);
    });

    it('shows the switch with List checked and mounts only the list after narrowing a desktop to a phone', () => {
      renderWithRouter(<MainPage />);

      resizeTo(TestWidth.Phone);

      expect(getSwitch()).toBeInTheDocument();
      expect(screen.getByRole('radio', {name: UiText.ViewList})).toBeChecked();
      expect(getList()).toBeInTheDocument();
      expect(getMap()).not.toBeInTheDocument();
    });

    it('shows both list and map without the switch on a desktop', () => {
      renderWithRouter(<MainPage />);

      expect(getSwitch()).not.toBeInTheDocument();
      expect(getList()).toBeInTheDocument();
      expect(getMap()).toBeInTheDocument();
    });
  });

  describe('search and view switch on a phone', () => {
    afterEach(() => {
      vi.useRealTimers();
    });

    function getSearchField() {
      return screen.getByRole('searchbox', {name: UiText.SearchByTitle});
    }

    function chooseView(name: string) {
      fireEvent.click(screen.getByRole('radio', {name}));
    }

    function waitForDelay() {
      act(() => {
        vi.advanceTimersByTime(DEBOUNCE_DELAY_MS);
      });
    }

    function renderOnPhoneWithFakeTimers() {
      vi.useFakeTimers();
      installMatchMedia(TestWidth.Phone);
      renderWithRouter(<MainPage />);
    }

    function resizeWithinDelay(width: number) {
      act(() => {
        setWidth(width);
      });
    }

    it('keeps the search text and resets the active card after narrowing from a tablet with Map chosen', () => {
      renderOnPhoneWithFakeTimers();
      chooseView(UiText.ViewMap);
      resizeWithinDelay(TestWidth.Tablet);
      const [firstCard] = screen.getAllByRole('article');
      fireEvent.mouseEnter(firstCard);
      expect(firstCard).toHaveClass('place-card--active');
      fireEvent.change(getSearchField(), {target: {value: 'one'}});

      resizeWithinDelay(TestWidth.Phone);
      chooseView(UiText.ViewList);
      waitForDelay();

      expect(getSearchField()).toHaveValue('one');
      expect(screen.getAllByRole('article')).toHaveLength(1);
      expect(screen.getByRole('heading', {level: 2})).toHaveTextContent('1 places to stay in Paris');
      expect(document.querySelectorAll('.place-card--active')).toHaveLength(0);
    });

    it('keeps the applied search text in the field and the list after Map and back to List', () => {
      renderOnPhoneWithFakeTimers();
      fireEvent.change(getSearchField(), {target: {value: 'one'}});
      waitForDelay();

      chooseView(UiText.ViewMap);
      chooseView(UiText.ViewList);

      expect(getSearchField()).toHaveValue('one');
      expect(screen.getAllByRole('article')).toHaveLength(1);
      expect(screen.getByRole('heading', {level: 2})).toHaveTextContent('1 places to stay in Paris');
    });

    it('applies the search text still waiting for the delay when Map is chosen', () => {
      renderOnPhoneWithFakeTimers();
      fireEvent.change(getSearchField(), {target: {value: 'one'}});

      chooseView(UiText.ViewMap);
      chooseView(UiText.ViewList);
      waitForDelay();

      expect(getSearchField()).toHaveValue('one');
      expect(screen.getAllByRole('article')).toHaveLength(1);
      expect(screen.getByRole('heading', {level: 2})).toHaveTextContent('1 places to stay in Paris');
    });
  });

  describe('search by title', () => {
    afterEach(() => {
      vi.useRealTimers();
    });

    function waitForSearchDelay() {
      act(() => {
        vi.advanceTimersByTime(DEBOUNCE_DELAY_MS);
      });
    }

    function search(query: string) {
      fireEvent.change(screen.getByRole('searchbox', {name: 'Search by title'}), {target: {value: query}});
    }

    it('filters the list by title ignoring case only after the delay', () => {
      vi.useFakeTimers();
      renderWithRouter(<MainPage />);

      search('ONE');
      expect(screen.getAllByRole('article')).toHaveLength(2);

      waitForSearchDelay();

      expect(screen.getAllByRole('article')).toHaveLength(1);
      expect(screen.getByText('Paris flat one')).toBeInTheDocument();
    });

    it('shows the number of found places in the heading', () => {
      vi.useFakeTimers();
      renderWithRouter(<MainPage />);

      search('two');
      waitForSearchDelay();

      expect(screen.getByRole('heading', {level: 2})).toHaveTextContent('1 places to stay in Paris');
    });

    it('searches only inside the active city', () => {
      vi.useFakeTimers();
      renderWithRouter(<MainPage />);

      search('canal');
      waitForSearchDelay();

      expect(screen.queryAllByRole('article')).toHaveLength(0);
      expect(screen.getByRole('heading', {level: 2})).toHaveTextContent('0 places to stay in Paris');
    });
  });
});

describe('city and sorting integration', () => {
  it.each(['Paris', 'Cologne', 'Brussels', 'Amsterdam', 'Hamburg', 'Dusseldorf'] as const)(
    'selects %s and keeps map, heading and cards consistent', (city) => {
      renderWithRouter(<MainPage />);
      fireEvent.mouseEnter(screen.getAllByRole('article')[0]);
      fireEvent.click(screen.getByRole('link', {name: city}));
      const count = fixtureOffers.filter((offer) => offer.city.name === city).length;
      expect(screen.getByRole('heading', {level: 2})).toHaveTextContent(`${String(count)} places to stay in ${city}`);
      expect(screen.queryAllByRole('article')).toHaveLength(count);
      expect(screen.getByRole('link', {name: city})).toHaveClass('cities__link--active');
      expect(mapRender).toHaveBeenLastCalledWith({
        city: CITY_CENTERS[city],
        offers: fixtureOffers.filter((offer) => offer.city.name === city),
        activeOfferId: city === 'Paris' ? 'paris-1' : null,
      });
    });

  it('opens and closes the menu and updates cards and map in all four orders', () => {
    renderWithRouter(<MainPage />);
    const button = screen.getByRole('button', {name: 'Sort by Popular'});
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    const offersById = new Map(fixtureOffers.map((offer) => [offer.id, offer]));
    const expectedOrders = [['paris-1', 'paris-2'], ['paris-2', 'paris-1'], ['paris-1', 'paris-2'], ['paris-2', 'paris-1']];
    for (const [index, option] of SORT_OPTIONS.entries()) {
      fireEvent.click(button);
      expect(button).toHaveAttribute('aria-expanded', 'true');
      fireEvent.click(screen.getByRole('option', {name: option}));
      expect(button).toHaveTextContent(option);
      expect(button).toHaveAttribute('aria-expanded', 'false');
      const titles = screen.getAllByRole('article').map((card) => card.querySelector('.place-card__title')?.textContent);
      const expected = expectedOrders[index].map((id) => offersById.get(id));
      expect(titles).toEqual(expected.map((offer) => offer?.title));
      expect(mapRender.mock.lastCall?.[0].offers).toEqual(expected);
    }
  });

  it('keeps typed search while choosing city and sort, then applies the delay inside the new city', () => {
    vi.useFakeTimers();
    try {
      renderWithRouter(<MainPage />);
      const search = screen.getByRole('searchbox');
      fireEvent.change(search, {target: {value: 'canal'}});
      fireEvent.click(screen.getByRole('link', {name: 'Amsterdam'}));
      expect(search).toHaveValue('canal');
      fireEvent.click(screen.getByRole('button', {name: 'Sort by Popular'}));
      fireEvent.click(screen.getByRole('option', {name: 'Top rated first'}));
      act(() => {
        vi.advanceTimersByTime(DEBOUNCE_DELAY_MS);
      });
      expect(screen.getAllByRole('article')).toHaveLength(1);
      expect(mapRender.mock.lastCall?.[0].offers).toEqual([fixtureOffers[2]]);
      fireEvent.change(search, {target: {value: 'missing'}});
      act(() => {
        vi.advanceTimersByTime(DEBOUNCE_DELAY_MS);
      });
      expect(screen.queryAllByRole('article')).toHaveLength(0);
      expect(mapRender.mock.lastCall?.[0]).toEqual({city: CITY_CENTERS.Amsterdam, offers: [], activeOfferId: null});
    } finally {
      vi.useRealTimers();
    }
  });
});

describe('sort keyboard selection', () => {
  it.each(['Enter', ' '])('returns focus to the trigger after selecting with %s', (key) => {
    renderWithRouter(<MainPage />);
    const trigger = screen.getByRole('button', {name: 'Sort by Popular'});
    fireEvent.click(trigger);
    const option = screen.getByRole('option', {name: 'Price: low to high'});
    act(() => {
      option.focus();
    });
    fireEvent.keyDown(option, {key});
    expect(screen.getAllByRole('article').map((card) => card.querySelector('.place-card__title')?.textContent))
      .toEqual(['Paris flat two', 'Paris flat one']);
    expect(option).toHaveAttribute('aria-selected', 'true');
    expect(trigger).toHaveTextContent('Price: low to high');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});
