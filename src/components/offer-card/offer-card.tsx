import type {JSX} from 'react';
import {AppRoute, CURRENCY_SIGN, Rating, UiText} from '../../const';
import type {OfferPreview} from '../../types/offer';
import {getRatingStars, getRatingWidth} from '../../utils/rating';

interface OfferCardProps {
  offer: OfferPreview;
}

// Размеры превью из вёрстки (course/markup/main.html).
const PreviewSize = {
  Width: 400,
  Height: 300,
} as const;

function OfferCard({offer}: OfferCardProps): JSX.Element {
  const {id, title, type, price, previewImage, isFavorite, isPremium, rating} = offer;
  const bookmarkClassName = `bookmark place-card__bookmark${isFavorite ? ' bookmark--active' : ''}`;

  return (
    <article className="place-card">
      <div className="place-card__image-wrapper">
        <img
          className="place-card__image"
          src={previewImage}
          width={PreviewSize.Width}
          height={PreviewSize.Height}
          alt={title}
          loading="lazy"
        />
        {isPremium && <span className="badge place-card__badge">{UiText.Premium}</span>}
        <button className={bookmarkClassName} type="button" aria-pressed={isFavorite}>
          <svg aria-hidden="true"><use href="#icon-bookmark" /></svg>
          <span className="visually-hidden">
            {isFavorite ? UiText.RemoveFromFavorites : UiText.AddToFavorites}
          </span>
        </button>
      </div>
      <div className="place-card__info">
        <p className="place-card__price"><b>{CURRENCY_SIGN}{price}</b> {UiText.PerNight}</p>
        <div
          className="rating"
          aria-label={`${UiText.RatingPrefix} ${String(getRatingStars(rating))} ${UiText.RatingOf} ${String(Rating.Max)}`}
        >
          {/* Ширина звёзд задаётся только переменной --rating, как в вёрстке. */}
          <span className="rating__fill" style={{'--rating': getRatingWidth(rating)}} />
        </div>
        <h3 className="place-card__title"><a href={`${AppRoute.Offer}/${id}`}>{title}</a></h3>
        <p className="place-card__type">{type}</p>
      </div>
    </article>
  );
}

export default OfferCard;
