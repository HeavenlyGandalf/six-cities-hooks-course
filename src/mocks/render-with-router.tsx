import {render, type RenderResult} from '@testing-library/react';
import type {ReactElement} from 'react';
import {MemoryRouter} from 'react-router';
import {AppRoute} from '../const';

interface RenderWithRouterOptions {
  // Адрес, с которого начинается история MemoryRouter.
  route?: string;
}

// Link и хуки роутера работают только внутри роутера, поэтому тесты компонентов рендерят их здесь.
export function renderWithRouter(ui: ReactElement, {route = AppRoute.Main}: RenderWithRouterOptions = {}): RenderResult {
  return render(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>);
}
