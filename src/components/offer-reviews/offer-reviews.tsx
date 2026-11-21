import type {JSX} from 'react';
import {AppRoute, UiText} from '../../const';
import type {Review} from '../../types/review';
import type {AuthInfo} from '../../types/user';
import ReviewForm from '../review-form/review-form';
import ReviewsList from '../reviews-list/reviews-list';

interface OfferReviewsProps {
  reviews: Review[];
  // null - гость: вместо формы приглашение войти (course/markup/offer-not-logged.html).
  user: AuthInfo | null;
}

function OfferReviews({reviews, user}: OfferReviewsProps): JSX.Element {
  return (
    <section className="offer__section reviews" aria-labelledby="reviews-title">
      <h2 className="offer__section-title" id="reviews-title">
        {UiText.ReviewsTitle} <span className="reviews__amount">{reviews.length}</span>
      </h2>
      <ReviewsList reviews={reviews} />
      {user ? (
        <ReviewForm />
      ) : (
        <p className="reviews__login">
          <a href={AppRoute.Login}>{UiText.SignIn}</a> {UiText.ReviewLoginSuffix}
        </p>
      )}
    </section>
  );
}

export default OfferReviews;
