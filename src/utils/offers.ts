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

// Предложения, в названии которых есть query, без учёта регистра.
// Пробелы по краям query не считаются; пустой query оставляет весь список.
export function filterByTitle(offers: OfferPreview[], query: string): OfferPreview[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (normalizedQuery === '') {
    return offers;
  }
  return offers.filter((offer) => offer.title.toLowerCase().includes(normalizedQuery));
}
