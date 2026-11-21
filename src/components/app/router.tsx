import type {RouteObject} from 'react-router';
import {AppRoute, AUTH_STATUS_STUB} from '../../const';
import PrivateRoute from '../../hocs/private-route/private-route';
import FavoritesPage from '../../pages/favorites/favorites-page';
import LoginPage from '../../pages/login/login-page';
import MainPage from '../../pages/main/main-page';
import NotFoundPage from '../../pages/not-found/not-found-page';
import OfferPage from '../../pages/offer/offer-page';
import ErrorScreen from '../error-screen/error-screen';

// Таблица маршрутов. Функция, а не константа: с эпика 6 она примет store для loader и action (M8).
// Корневой маршрут без element - только общий errorElement; шапку страницы рисуют сами.
export function createAppRoutes(): RouteObject[] {
  return [
    {
      path: AppRoute.Main,
      errorElement: <ErrorScreen />,
      children: [
        {
          index: true,
          element: <MainPage />,
        },
        {
          path: AppRoute.Login,
          element: (
            <PrivateRoute authStatus={AUTH_STATUS_STUB} mode="guest">
              <LoginPage />
            </PrivateRoute>
          ),
        },
        {
          path: AppRoute.Favorites,
          element: (
            <PrivateRoute authStatus={AUTH_STATUS_STUB} mode="private">
              <FavoritesPage />
            </PrivateRoute>
          ),
        },
        {
          path: AppRoute.OfferPattern,
          element: <OfferPage />,
        },
        {
          path: AppRoute.NotFound,
          element: <NotFoundPage />,
        },
      ],
    },
  ];
}
