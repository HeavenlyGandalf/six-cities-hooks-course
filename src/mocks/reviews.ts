import type {Review} from '../types/review';

export const reviews: Review[] = [
  {
    id: 'b67ddfd5-b953-4a30-8c8d-bd083cd6b62a',
    date: '2019-04-24T14:13:56.569Z',
    user: {name: 'Max', avatarUrl: '/img/avatars/avatar-max.svg', isPro: false},
    comment: 'A quiet cozy and picturesque that hides behind a a river by the unique lightness of Amsterdam.',
    rating: 4,
  },
  {
    id: 'c3e5a7b9-1d2f-4e6a-8b0c-2d4f6a8b0c2e',
    date: '2019-05-08T09:20:11.000Z',
    user: {name: 'Angelina', avatarUrl: '/img/avatars/avatar-angelina.svg', isPro: true},
    comment: 'The apartment is clean and bright, the host answered every question within minutes.',
    rating: 4.6,
  },
  {
    id: 'd4f6b8c0-2e3a-4f7b-9c1d-3e5a7b9c1d3f',
    date: '2020-01-15T18:45:00.000Z',
    user: {name: 'Leon', avatarUrl: '/img/avatars/avatar-leon.svg', isPro: false},
    comment: 'Great location, but the street can be noisy at night.',
    rating: 3.2,
  },
];
