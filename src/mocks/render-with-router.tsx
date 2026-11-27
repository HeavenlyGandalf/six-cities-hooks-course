import {Provider} from 'react-redux';
import {createStore, type AppStore} from '../store/store';
import {fillOffers} from '../store/offers/offers';
import {offers} from './offers';
import {render, type RenderResult} from '@testing-library/react';
import type {ReactElement} from 'react';
import {MemoryRouter} from 'react-router';
import {AppRoute} from '../const';

interface RenderWithRouterOptions {
  // Адрес, с которого начинается история MemoryRouter.
  route?: string;
  store?: AppStore;
}

// Link и хуки роутера работают только внутри роутера, поэтому тесты компонентов рендерят их здесь.
export function renderWithRouter(ui: ReactElement, {route = AppRoute.Main, store}: RenderWithRouterOptions = {}): RenderResult {
  const appStore = store ?? createStore();
  if (!store) {
    appStore.dispatch(fillOffers(offers));
  }
  return render(<Provider store={appStore}><MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter></Provider>);
}
