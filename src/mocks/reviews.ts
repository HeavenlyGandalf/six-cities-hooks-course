import type {Review} from '../types/review';

// 12 отзывов вперемешку по датам: на странице видны лимит MAX_REVIEWS и порядок «новые сверху».
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
  {
    id: 'e5a7c9d1-3f4b-4a8c-8d2e-4f6b8c0d2e4a',
    date: '2023-08-19T10:05:00.000Z',
    user: {name: 'Sophia', avatarUrl: '/img/avatars/avatar-sophia.svg', isPro: true},
    comment: 'Lovely place, we would definitely come back next summer.',
    rating: 5,
  },
  {
    id: 'f6b8d0e2-4a5c-4b9d-9e3f-5a7c9d1e3f5b',
    date: '2021-03-02T16:30:00.000Z',
    user: {name: 'Oliver', avatarUrl: '/img/avatars/user-1.svg', isPro: false},
    comment: 'Comfortable beds and a well equipped kitchen.',
    rating: 4,
  },
  {
    id: 'a7c9e1f3-5b6d-4c0e-8f4a-6b8d0e2f4a6c',
    date: '2022-11-27T07:15:00.000Z',
    user: {name: 'Emma', avatarUrl: '/img/avatars/user-2.svg', isPro: false},
    comment: 'The heating did not work for the first night, then it was fixed.',
    rating: 3,
  },
  {
    id: 'b8d0f2a4-6c7e-4d1f-9a5b-7c9e1f3a5b7d',
    date: '2019-09-10T12:00:00.000Z',
    user: {name: 'Lucas', avatarUrl: '/img/avatars/user-4.svg', isPro: false},
    comment: 'Nice view from the window and a quiet courtyard.',
    rating: 4,
  },
  {
    id: 'c9e1a3b5-7d8f-4e2a-8b6c-8d0f2a4b6c8e',
    date: '2024-02-14T19:40:00.000Z',
    user: {name: 'Mia', avatarUrl: '/img/avatars/user-5.svg', isPro: false},
    comment: 'Perfect for a short city break, everything is within walking distance.',
    rating: 5,
  },
  {
    id: 'd0f2b4c6-8e9a-4f3b-9c7d-9e1a3b5c7d9f',
    date: '2020-07-21T08:25:00.000Z',
    user: {name: 'Noah', avatarUrl: '/img/avatars/user-6.svg', isPro: false},
    comment: 'A bit smaller than on the photos, but clean and cozy.',
    rating: 3,
  },
  {
    id: 'e1a3c5d7-9f0b-4a4c-8d8e-0f2b4c6d8e0a',
    date: '2023-01-05T13:50:00.000Z',
    user: {name: 'Chloe', avatarUrl: '/img/avatars/user-7.svg', isPro: false},
    comment: 'The host met us at the door and showed the best places nearby.',
    rating: 5,
  },
  {
    id: 'f2b4d6e8-0a1c-4b5d-9e9f-1a3c5d7e9f1b',
    date: '2021-10-30T21:10:00.000Z',
    user: {name: 'Ethan', avatarUrl: '/img/avatars/user-8.svg', isPro: false},
    comment: 'Good value for the price, fast wifi.',
    rating: 4,
  },
  {
    id: 'a3c5e7f9-1b2d-4c6e-8f0a-2b4d6e8f0a2c',
    date: '2022-05-16T11:35:00.000Z',
    user: {name: 'Lea', avatarUrl: '/img/avatars/user-9.svg', isPro: false},
    comment: 'Bright rooms and a balcony with flowers.',
    rating: 4,
  },
];
