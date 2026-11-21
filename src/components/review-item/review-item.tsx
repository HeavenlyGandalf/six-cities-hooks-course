import type {JSX} from 'react';
import {Rating, UiText} from '../../const';
import type {Review} from '../../types/review';
import {formatReviewDate, toDateAttribute} from '../../utils/format';
import {getRatingStars, getRatingWidth} from '../../utils/rating';

interface ReviewItemProps {
  review: Review;
}

// Размер аватара автора отзыва из вёрстки (course/markup/offer.html), px.
const AVATAR_SIZE = 54;

function ReviewItem({review}: ReviewItemProps): JSX.Element {
  const {date, user, comment, rating} = review;

  return (
    <li className="review">
      <img className="review__avatar" src={user.avatarUrl} width={AVATAR_SIZE} height={AVATAR_SIZE} alt="" loading="lazy" />
      <div className="review__body">
        <div className="review__head">
          <p className="review__name">{user.name}</p>
          <time className="review__date" dateTime={toDateAttribute(date)}>{formatReviewDate(date)}</time>
        </div>
        <div
          className="rating"
          aria-label={`${UiText.RatingPrefix} ${String(getRatingStars(rating))} ${UiText.RatingOf} ${String(Rating.Max)}`}
        >
          <span className="rating__fill" style={{'--rating': getRatingWidth(rating)}} />
        </div>
        <p className="review__text">{comment}</p>
      </div>
    </li>
  );
}

export default ReviewItem;
