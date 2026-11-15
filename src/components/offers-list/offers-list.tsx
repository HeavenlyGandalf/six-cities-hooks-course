import type {JSX} from 'react';
import type {OfferPreview} from '../../types/offer';
import OfferCard from '../offer-card/offer-card';

interface OffersListProps {
  offers: OfferPreview[];
}

function OffersList({offers}: OffersListProps): JSX.Element {
  return (
    <div className="places-grid">
      {offers.map((offer) => <OfferCard key={offer.id} offer={offer} />)}
    </div>
  );
}

export default OffersList;
