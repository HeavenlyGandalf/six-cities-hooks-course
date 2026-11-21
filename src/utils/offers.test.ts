import {describe, expect, it} from 'vitest';
import type {OfferPreview} from '../types/offer';
import {getNearOffers, groupByCity} from './offers';

function createOffer(id: string, cityName: string): OfferPreview {
  return {
    id,
    title: id,
    type: 'room',
    price: 80,
    previewImage: '/img/offers/2.jpg',
    city: {name: cityName, location: {latitude: 0, longitude: 0, zoom: 13}},
    location: {latitude: 0, longitude: 0, zoom: 16},
    isFavorite: true,
    isPremium: false,
    rating: 3,
  };
}

describe('groupByCity', () => {
  it('groups offers by city in order of first appearance', () => {
    const offers = [
      createOffer('a', 'Cologne'),
      createOffer('b', 'Paris'),
      createOffer('c', 'Cologne'),
    ];

    const groups = groupByCity(offers);

    expect(groups.map((group) => group.city)).toEqual(['Cologne', 'Paris']);
    expect(groups[0].offers.map((offer) => offer.id)).toEqual(['a', 'c']);
    expect(groups[1].offers.map((offer) => offer.id)).toEqual(['b']);
  });

  it('returns no groups for no offers', () => {
    expect(groupByCity([])).toEqual([]);
  });
});

describe('getNearOffers', () => {
  const offers = ['a', 'b', 'c', 'd', 'e'].map((id) => createOffer(id, 'Paris'));

  it('excludes the current offer, keeps order and cuts to the limit', () => {
    expect(getNearOffers(offers, 'b', 3).map((offer) => offer.id)).toEqual(['a', 'c', 'd']);
  });

  it('returns all other offers when there are fewer than the limit', () => {
    expect(getNearOffers(offers, 'a', 10).map((offer) => offer.id)).toEqual(['b', 'c', 'd', 'e']);
  });
});
