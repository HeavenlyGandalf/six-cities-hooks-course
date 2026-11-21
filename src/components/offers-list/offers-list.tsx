import type {JSX} from 'react';
import type {OfferPreview} from '../../types/offer';
import OfferCard, {type OfferCardVariant} from '../offer-card/offer-card';

interface OffersListProps {
  offers: OfferPreview[];
  // Класс обёртки целиком: places-grid на главной, places-grid near-places__list у соседних,
  // favorites__places в избранном.
  className?: string;
  variant?: OfferCardVariant;
  // Активную карточку хранит страница; без onCardHover список не следит за наведением (соседние).
  activeOfferId?: string | null;
  onCardHover?: (offerId: string | null) => void;
}

function OffersList({
  offers,
  className = 'places-grid',
  variant,
  activeOfferId = null,
  onCardHover,
}: OffersListProps): JSX.Element {
  return (
    <div className={className}>
      {offers.map((offer) => (
        <OfferCard
          key={offer.id}
          offer={offer}
          variant={variant}
          isActive={offer.id === activeOfferId}
          onCardHover={onCardHover}
        />
      ))}
    </div>
  );
}

export default OffersList;
