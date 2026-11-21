import type {JSX} from 'react';
import {Link} from 'react-router';
import Footer from '../../components/footer/footer';
import Header from '../../components/header/header';
import OffersList from '../../components/offers-list/offers-list';
import {AppRoute, CITIES, DEFAULT_CITY, DEFAULT_SORT, SORT_OPTIONS, UiText} from '../../const';
import {offers} from '../../mocks/offers';
import {stubUser} from '../../mocks/user';
import {formatPageTitle} from '../../utils/format';

// Этап 2 статичный: город и сортировка зафиксированы, обработчиков нет.
// Ссылки городов ведут на главную, выбор города появится вместе с маршрутизацией и store.
function MainPage(): JSX.Element {
  const activeCity = DEFAULT_CITY;
  const cityOffers = offers.filter((offer) => offer.city.name === activeCity);
  const favoriteCount = offers.filter((offer) => offer.isFavorite).length;

  return (
    <div className="page">
      <title>{formatPageTitle(activeCity)}</title>
      <Header user={stubUser} favoriteCount={favoriteCount} />

      <main className="page__main">
        <h1 className="visually-hidden">{UiText.CitiesHeading}</h1>
        <nav className="cities" aria-label={UiText.CitiesLabel}>
          <div className="container">
            <ul className="cities__list">
              {CITIES.map((city) => {
                const isActive = city === activeCity;
                return (
                  <li key={city}>
                    <Link
                      className={`cities__link${isActive ? ' cities__link--active' : ''}`}
                      to={AppRoute.Main}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {city}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        <div className="container places-layout">
          {/* Переключатель List/Map работает на CSS (:has в pages/main.css), поэтому радиокнопки неуправляемые. */}
          <div className="view-switch" role="radiogroup" aria-label={UiText.ViewLabel}>
            <input className="view-switch__input" type="radio" name="view" id="view-list" defaultChecked />
            <label className="view-switch__label" htmlFor="view-list">{UiText.ViewList}</label>
            <input className="view-switch__input" type="radio" name="view" id="view-map" />
            <label className="view-switch__label" htmlFor="view-map">{UiText.ViewMap}</label>
          </div>

          {/* Заглушка карты без маркеров: Яндекс Карты подключаются в H5. */}
          <section className="places-layout__map" aria-label={UiText.MapLabel}>
            <div className="map">
              <span className="map__note">{UiText.MapNote}</span>
            </div>
          </section>

          <section className="places places-layout__list">
            <div className="places__head">
              <h2 className="places__title">
                {cityOffers.length} {UiText.PlacesToStayIn} {activeCity}
              </h2>
              <div className="places__tools">
                <div className="sort">
                  <span className="sort__caption" id="sort-caption">{UiText.SortBy}</span>
                  <button
                    className="sort__current"
                    type="button"
                    aria-haspopup="listbox"
                    aria-expanded="false"
                    aria-labelledby="sort-caption sort-current"
                  >
                    <span id="sort-current">{DEFAULT_SORT}</span>
                    <svg className="sort__arrow" aria-hidden="true"><use href="#icon-arrow" /></svg>
                  </button>
                  <ul className="sort__list" role="listbox" aria-labelledby="sort-caption">
                    {SORT_OPTIONS.map((option) => {
                      const isActive = option === DEFAULT_SORT;
                      return (
                        <li
                          key={option}
                          className={`sort__option${isActive ? ' sort__option--active' : ''}`}
                          role="option"
                          aria-selected={isActive}
                        >
                          {option}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>

            <OffersList offers={cityOffers} />
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default MainPage;
