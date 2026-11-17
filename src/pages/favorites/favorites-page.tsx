import type {JSX} from 'react';
import Footer from '../../components/footer/footer';
import Header from '../../components/header/header';
import OffersList from '../../components/offers-list/offers-list';
import {AppRoute, UiText} from '../../const';
import {offers} from '../../mocks/offers';
import {authInfo} from '../../mocks/user';
import {groupByCity} from '../../utils/offers';

// Пустое состояние (favorites-empty.html) появится в истории 8.2.
function FavoritesPage(): JSX.Element {
  const favoriteOffers = offers.filter((offer) => offer.isFavorite);
  const groups = groupByCity(favoriteOffers);

  return (
    <div className="page">
      <Header user={authInfo} favoriteCount={favoriteOffers.length} />

      <main className="page__main">
        <div className="container favorites">
          <h1 className="favorites__title">{UiText.FavoritesTitle}</h1>
          <ul className="favorites__list">
            {groups.map(({city, offers: cityOffers}) => {
              const titleId = `fav-${city.toLowerCase()}`;
              return (
                <li key={city} className="favorites__group">
                  <section className="favorites__city" aria-labelledby={titleId}>
                    <h2 className="favorites__city-title" id={titleId}>
                      <a className="favorites__city-link" href={AppRoute.Main}>
                        <svg className="favorites__city-icon" aria-hidden="true"><use href="#icon-pin" /></svg>
                        {city}
                      </a>
                    </h2>
                    <OffersList offers={cityOffers} className="favorites__places" variant="row" />
                  </section>
                </li>
              );
            })}
          </ul>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default FavoritesPage;
