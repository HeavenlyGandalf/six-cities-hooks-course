import type {Offer} from '../types/offer';
import {offers} from './offers';

// Полное предложение для страницы предложения. 7 фото - чтобы проверить предел MAX_IMAGES.
export const offer: Offer = {
  id: offers[0].id,
  title: 'Beautiful & luxurious studio at great location',
  type: 'apartment',
  price: 120,
  city: offers[0].city,
  location: offers[0].location,
  isFavorite: false,
  isPremium: true,
  rating: 4.8,
  description: 'A quiet cozy and picturesque that hides behind a river by the unique lightness of Amsterdam. The building is green and from 18th century.',
  bedrooms: 3,
  goods: [
    'Wifi',
    'Washing machine',
    'Towels',
    'Heating',
    'Coffee machine',
    'Baby seat',
    'Kitchen',
    'Dishwasher',
    'Cable TV',
    'Fridge',
  ],
  host: {
    name: 'Angelina',
    avatarUrl: '/img/avatars/avatar-angelina.svg',
    isPro: true,
  },
  images: [
    '/img/offers/1.jpg',
    '/img/offers/4.jpg',
    '/img/offers/6.jpg',
    '/img/offers/8.jpg',
    '/img/offers/10.jpg',
    '/img/offers/12.jpg',
    '/img/offers/14.jpg',
  ],
  maxAdults: 4,
};
