import type {FocusEvent, JSX} from 'react';
import {generatePath, Link} from 'react-router';
import {AppRoute, CURRENCY_SIGN, Rating, UiText} from '../../const';
import type {OfferPreview} from '../../types/offer';
import {getRatingStars, getRatingWidth} from '../../utils/rating';

// grid - карточка в сетке (главная, соседние), row - компактная строка (избранное).
export type OfferCardVariant = 'grid' | 'row';

interface OfferCardProps {
  offer: OfferPreview;
  variant?: OfferCardVariant;
  isActive?: boolean;
  // Сообщает id карточки под курсором или с фокусом внутри и null, когда они ушли.
  onCardHover?: (offerId: string | null) => void;
}

// Размеры превью из вёрстки (course/markup/main.html).
const PreviewSize = {
  Width: 400,
  Height: 300,
} as const;

function OfferCard({offer, variant = 'grid', isActive = false, onCardHover}: OfferCardProps): JSX.Element {
  const {id, title, type, price, previewImage, isFavorite, isPremium, rating} = offer;
  const isRow = variant === 'row';
  const cardClassName = `place-card${isRow ? ' place-card--row' : ''}${isActive ? ' place-card--active' : ''}`;

  // Фокус, перешедший на другой элемент той же карточки, не сбрасывает активность.
  const handleBlur = (event: FocusEvent<HTMLElement>) => {
    const {relatedTarget, currentTarget} = event;
    if (relatedTarget instanceof Node && currentTarget.contains(relatedTarget)) {
      return;
    }
    onCardHover?.(null);
  };
  const bookmarkClassName = `bookmark place-card__bookmark${isFavorite ? ' bookmark--active' : ''}`;

  const bookmark = (
    <button className={bookmarkClassName} type="button" aria-pressed={isFavorite}>
      <svg aria-hidden="true"><use href="#icon-bookmark" /></svg>
      <span className="visually-hidden">
        {isFavorite ? UiText.RemoveFromFavorites : UiText.AddToFavorites}
      </span>
    </button>
  );

  return (
    <article
      className={cardClassName}
      onMouseEnter={() => onCardHover?.(id)}
      onMouseLeave={() => onCardHover?.(null)}
      onFocus={() => onCardHover?.(id)}
      onBlur={handleBlur}
    >
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
        {!isRow && bookmark}
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
        <h3 className="place-card__title"><Link to={generatePath(AppRoute.OfferPattern, {id})}>{title}</Link></h3>
        <p className="place-card__type">{type}</p>
      </div>
      {/* В строке закладка стоит после .place-card__info: под неё отступ справа в main.css. */}
      {isRow && bookmark}
    </article>
  );
}

export default OfferCard;
