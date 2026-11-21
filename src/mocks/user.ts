import {AUTH_STATUS_STUB, AuthStatus} from '../const';
import type {AuthInfo} from '../types/user';

export const authInfo: AuthInfo = {
  name: 'Oliver',
  avatarUrl: '/img/avatars/user-3.svg',
  isPro: false,
  email: 'oliver.conner@gmail.com',
  token: 'T2xpdmVyLmNvbm5lckBnbWFpbC5jb20=',
};

// Пользователь по заглушке статуса: до этапа 7 страницы берут его вместо authInfo,
// чтобы шапка и форма отзыва совпадали с приватным маршрутом.
export const stubUser: AuthInfo | null = AUTH_STATUS_STUB === AuthStatus.Auth ? authInfo : null;
