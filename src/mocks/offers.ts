import type {City, OfferPreview} from '../types/offer';

export const PARIS: City = {
  name: 'Paris',
  location: {latitude: 48.85661, longitude: 2.351499, zoom: 13},
};

export const offers: OfferPreview[] = [
  {
    id: '6af6f711-c28d-4121-82cd-e0b462a27f00',
    title: 'Beautiful & luxurious apartment at great location',
    type: 'apartment',
    price: 120,
    previewImage: '/img/offers/1.jpg',
    city: PARIS,
    location: {latitude: 48.868610000000004, longitude: 2.342499, zoom: 16},
    isFavorite: false,
    isPremium: true,
    rating: 3.1,
  },
  {
    id: '1b7d9c3e-5f2a-4e8b-9c1d-2a3b4c5d6e7f',
    title: 'Wood and stone place',
    type: 'room',
    price: 80,
    previewImage: '/img/offers/2.jpg',
    city: PARIS,
    location: {latitude: 48.858610000000006, longitude: 2.330499, zoom: 16},
    isFavorite: true,
    isPremium: false,
    rating: 4.5,
  },
  {
    id: '9f2b4a6c-8d1e-4f3a-b5c7-d9e1f3a5b7c9',
    title: 'Canal View Saint-Martin',
    type: 'house',
    price: 132,
    previewImage: '/img/offers/13.jpg',
    city: PARIS,
    location: {latitude: 48.834610000000005, longitude: 2.335499, zoom: 16},
    isFavorite: false,
    isPremium: false,
    rating: 4,
  },
  {
    id: '7c1a3e5b-9d2f-4a6c-8e1b-3d5f7a9c1e3b',
    title: 'Nice, cozy, warm big bed hotel room',
    type: 'hotel',
    price: 180,
    previewImage: '/img/offers/5.jpg',
    city: PARIS,
    location: {latitude: 48.85761, longitude: 2.358499, zoom: 16},
    isFavorite: true,
    isPremium: true,
    rating: 4.8,
  },
];
