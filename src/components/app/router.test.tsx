import {render, screen} from '@testing-library/react';
import {createMemoryRouter} from 'react-router';
import {describe, expect, it} from 'vitest';
import {AppRoute, DEFAULT_CITY} from '../../const';
import App from './app';
import {createAppRoutes} from './router';

function renderRoute(route: string) {
  const router = createMemoryRouter(createAppRoutes(), {initialEntries: [route]});
  render(<App router={router} />);
  return router;
}

describe('App routes', () => {
  it('renders the main page at /', () => {
    renderRoute(AppRoute.Main);

    expect(screen.getByRole('heading', {level: 2})).toHaveTextContent(`places to stay in ${DEFAULT_CITY}`);
    expect(screen.getAllByRole('article').length).toBeGreaterThan(0);
  });
});
