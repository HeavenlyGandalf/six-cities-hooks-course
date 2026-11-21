import type {JSX} from 'react';
import type {Review} from '../../types/review';
import ReviewItem from '../review-item/review-item';

interface ReviewsListProps {
  reviews: Review[];
}

// Правила «не больше 10» и «новые сверху» появятся в эпиках 5 и 7.
function ReviewsList({reviews}: ReviewsListProps): JSX.Element {
  return (
    <ul className="reviews__list">
      {reviews.map((review) => <ReviewItem key={review.id} review={review} />)}
    </ul>
  );
}

export default ReviewsList;
