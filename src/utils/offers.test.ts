import {describe, expect, it} from 'vitest';
import {SortType} from '../const';
import type {OfferPreview} from '../types/offer';
import {filterByTitle, getNearOffers, groupByCity, sortOffers} from './offers';

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

describe('filterByTitle', () => {
  const offers = [
    {...createOffer('a', 'Paris'), title: 'Canal View House'},
    {...createOffer('b', 'Paris'), title: 'Quiet room'},
    {...createOffer('c', 'Paris'), title: 'Big house with garden'},
  ];

  it('keeps offers whose title contains the query, ignoring case', () => {
    expect(filterByTitle(offers, 'HOUSE').map((offer) => offer.id)).toEqual(['a', 'c']);
  });

  it('ignores spaces around the query', () => {
    expect(filterByTitle(offers, '  quiet ').map((offer) => offer.id)).toEqual(['b']);
  });

  it('returns all offers for an empty or blank query', () => {
    expect(filterByTitle(offers, '')).toEqual(offers);
    expect(filterByTitle(offers, '   ')).toEqual(offers);
  });

  it('returns an empty list when nothing matches', () => {
    expect(filterByTitle(offers, 'castle')).toEqual([]);
  });
});

describe('sortOffers', () => {
  const offers = [
    {...createOffer('a', 'Paris'), price: 120, rating: 3},
    {...createOffer('b', 'Paris'), price: 80, rating: 5},
    {...createOffer('c', 'Paris'), price: 120, rating: 5},
  ];

  it.each([
    [SortType.Popular, ['a', 'b', 'c']],
    [SortType.PriceAscending, ['b', 'a', 'c']],
    [SortType.PriceDescending, ['a', 'c', 'b']],
    [SortType.RatingDescending, ['b', 'c', 'a']],
  ])('sorts by %s without changing the source or equal values order', (sort, ids) => {
    const source = structuredClone(offers);
    expect(sortOffers(offers, sort).map((offer) => offer.id)).toEqual(ids);
    expect(offers).toEqual(source);
    expect(sortOffers([], sort)).toEqual([]);
  });
});
