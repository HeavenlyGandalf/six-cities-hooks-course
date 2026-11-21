import type {RouteObject} from 'react-router';
import {AppRoute} from '../../const';
import MainPage from '../../pages/main/main-page';

// Таблица маршрутов. Функция, а не константа: с эпика 6 она примет store для loader и action (M8).
export function createAppRoutes(): RouteObject[] {
  return [
    {
      path: AppRoute.Main,
      element: <MainPage />,
    },
  ];
}
