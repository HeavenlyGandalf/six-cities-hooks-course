import type {Offer, OfferPreview} from '../types/offer';
import {offers} from './offers';

type OfferDetails = Pick<Offer, 'description' | 'bedrooms' | 'goods' | 'host' | 'images' | 'maxAdults'>;

// Полное предложение = поля карточки без previewImage + подробности страницы предложения.
function createFullOffer({previewImage: _previewImage, ...preview}: OfferPreview, details: OfferDetails): Offer {
  return {...preview, ...details};
}

const ANGELINA = {
  name: 'Angelina',
  avatarUrl: '/img/avatars/avatar-angelina.svg',
  isPro: true,
};

const LEON = {
  name: 'Leon',
  avatarUrl: '/img/avatars/avatar-leon.svg',
  isPro: false,
};

// Полные предложения для страницы /offer/:id, по одному на каждую карточку из offers.
// У первого 7 фото - чтобы проверить предел MAX_IMAGES.
export const fullOffers: Offer[] = [
  createFullOffer(offers[0], {
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
    host: ANGELINA,
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
  }),
  createFullOffer(offers[1], {
    description: 'A small room with wooden beams and stone walls, a short walk from the Seine.',
    bedrooms: 1,
    goods: ['Wifi', 'Heating', 'Towels'],
    host: LEON,
    images: ['/img/offers/2.jpg', '/img/offers/3.jpg', '/img/offers/7.jpg'],
    maxAdults: 1,
  }),
  createFullOffer(offers[2], {
    description: 'A house on the Canal Saint-Martin with a garden and a view of the water.',
    bedrooms: 2,
    goods: ['Wifi', 'Kitchen', 'Washing machine', 'Fridge'],
    host: ANGELINA,
    images: ['/img/offers/13.jpg', '/img/offers/9.jpg', '/img/offers/11.jpg', '/img/offers/15.jpg'],
    maxAdults: 3,
  }),
  createFullOffer(offers[3], {
    description: 'A warm hotel room with a big bed and breakfast served every morning.',
    bedrooms: 1,
    goods: ['Wifi', 'Breakfast', 'Air conditioning', 'Towels', 'Cable TV'],
    host: LEON,
    images: ['/img/offers/5.jpg', '/img/offers/16.jpg', '/img/offers/17.jpg', '/img/offers/18.jpg'],
    maxAdults: 2,
  }),
];
