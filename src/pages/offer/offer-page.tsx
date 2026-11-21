import type {JSX} from 'react';
import {useParams} from 'react-router';
import Footer from '../../components/footer/footer';
import Header from '../../components/header/header';
import OfferGallery from '../../components/offer-gallery/offer-gallery';
import OfferHost from '../../components/offer-host/offer-host';
import OfferReviews from '../../components/offer-reviews/offer-reviews';
import OffersList from '../../components/offers-list/offers-list';
import {CURRENCY_SIGN, MAX_NEAR_PLACES, UiText} from '../../const';
import {fullOffers} from '../../mocks/offer';
import {offers} from '../../mocks/offers';
import {reviews} from '../../mocks/reviews';
import {stubUser} from '../../mocks/user';
import type {Offer} from '../../types/offer';
import {capitalize, formatPageTitle, pluralize} from '../../utils/format';
import {getNearOffers} from '../../utils/offers';
import {getRatingWidth} from '../../utils/rating';
import NotFoundPage from '../not-found/not-found-page';

interface OfferContentProps {
  offer: Offer;
}

// Предложение, отзывы и соседние пока из моков; загрузка с сервера - этап 7.
function OfferContent({offer}: OfferContentProps): JSX.Element {
  const {title, type, price, isFavorite, isPremium, rating, description, bedrooms, goods, host, images, maxAdults} = offer;
  const nearOffers = getNearOffers(offers, offer.id, MAX_NEAR_PLACES);
  const favoriteCount = offers.filter((item) => item.isFavorite).length;
  const bookmarkClassName = `bookmark offer-summary__bookmark${isFavorite ? ' bookmark--active' : ''}`;

  return (
    <div className="page">
      <title>{formatPageTitle(title)}</title>
      <Header user={stubUser} favoriteCount={favoriteCount} />

      <main className="page__main offer">
        <div className="container">
          <OfferGallery images={images} title={title} />
        </div>

        <div className="container offer__layout">
          <div className="offer__head">
            {isPremium && <span className="badge offer__badge">{UiText.Premium}</span>}
            <h1 className="offer__title">{title}</h1>
            <div className="offer__rating">
              {/* Звёзды округлены, число выводится как пришло с сервера. */}
              <div className="rating rating--large" aria-hidden="true">
                <span className="rating__fill" style={{'--rating': getRatingWidth(rating)}} />
              </div>
              <span className="offer__rating-value">
                <span className="visually-hidden">{UiText.RatingPrefix} </span>{rating}
              </span>
            </div>
            <ul className="offer__features">
              <li className="offer__feature offer__feature--type">{capitalize(type)}</li>
              <li className="offer__feature offer__feature--bedrooms">
                {bedrooms} {pluralize(bedrooms, UiText.Bedroom, UiText.Bedrooms)}
              </li>
              <li className="offer__feature offer__feature--adults">
                {UiText.MaxAdultsPrefix} {maxAdults} {pluralize(maxAdults, UiText.Adult, UiText.Adults)}
              </li>
            </ul>
          </div>

          <aside className="offer__aside" aria-label={UiText.BookingLabel}>
            <div className="offer-summary">
              <p className="offer-summary__price"><b>{CURRENCY_SIGN}{price}</b> {UiText.PerNight}</p>
              <button className={bookmarkClassName} type="button" aria-pressed={isFavorite}>
                <svg aria-hidden="true"><use href="#icon-bookmark" /></svg>
                <span className="visually-hidden">
                  {isFavorite ? UiText.RemoveFromFavorites : UiText.AddToFavorites}
                </span>
              </button>
            </div>
          </aside>

          <div className="offer__details">
            <section className="offer__section" aria-labelledby="goods-title">
              <h2 className="offer__section-title" id="goods-title">{UiText.GoodsTitle}</h2>
              <ul className="goods">
                {goods.map((item) => <li key={item} className="goods__item">{item}</li>)}
              </ul>
            </section>

            <section className="offer__section" aria-labelledby="host-title">
              <h2 className="offer__section-title" id="host-title">{UiText.HostTitle}</h2>
              <OfferHost host={host} description={description} />
            </section>

            <OfferReviews offerId={offer.id} reviews={reviews} user={stubUser} />
          </div>
        </div>

        {/* Заглушка карты без маркеров: Яндекс Карты подключаются в эпике 5. */}
        <section className="container offer__map" aria-label={UiText.NearMapLabel}>
          <div className="map">
            <span className="map__note">{UiText.MapNote}</span>
          </div>
        </section>

        <section className="container near-places" aria-labelledby="near-title">
          <h2 className="near-places__title" id="near-title">{UiText.NearPlacesTitle}</h2>
          <OffersList offers={nearOffers} className="places-grid near-places__list" />
        </section>
      </main>

      <Footer />
    </div>
  );
}

// id берётся из адреса /offer/:id. Неизвестный id - та же 404, что и для неизвестного адреса.
function OfferPage(): JSX.Element {
  const {id} = useParams();
  const offer = fullOffers.find((item) => item.id === id);

  if (!offer) {
    return <NotFoundPage />;
  }

  // key={offer.id}: при переходе на другое предложение состояние содержимого создаётся заново.
  return <OfferContent key={offer.id} offer={offer} />;
}

export default OfferPage;
