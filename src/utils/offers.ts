import type {OfferPreview} from '../types/offer';

export interface CityGroup {
  city: string;
  offers: OfferPreview[];
}

// Группы по city.name в порядке первого появления города в списке.
export function groupByCity(offers: OfferPreview[]): CityGroup[] {
  const groups = new Map<string, OfferPreview[]>();

  offers.forEach((offer) => {
    const group = groups.get(offer.city.name);
    if (group) {
      group.push(offer);
    } else {
      groups.set(offer.city.name, [offer]);
    }
  });

  return Array.from(groups, ([city, cityOffers]) => ({city, offers: cityOffers}));
}

// Соседние предложения: без текущего, в исходном порядке, не больше limit.
export function getNearOffers(offers: OfferPreview[], currentId: string, limit: number): OfferPreview[] {
  return offers.filter((offer) => offer.id !== currentId).slice(0, limit);
}
