import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {createMemoryRouter, type RouteObject} from 'react-router';
import {afterEach, describe, expect, it, vi} from 'vitest';
import {AppRoute, DEFAULT_CITY} from '../../const';
import {fullOffers} from '../../mocks/offer';
import App from './app';
import {createAppRoutes} from './router';

const [offer] = fullOffers;

function renderRoute(route: string, routes: RouteObject[] = createAppRoutes()) {
  const router = createMemoryRouter(routes, {initialEntries: [route]});
  render(<App router={router} />);
  return router;
}

describe('App routes', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the main page at /', () => {
    renderRoute(AppRoute.Main);

    expect(screen.getByRole('heading', {level: 2})).toHaveTextContent(`places to stay in ${DEFAULT_CITY}`);
    expect(screen.getAllByRole('article').length).toBeGreaterThan(0);
  });

  it('renders the login page at /login for a guest', () => {
    renderRoute(AppRoute.Login);

    expect(screen.getByRole('heading', {level: 1, name: 'Sign in'})).toBeInTheDocument();
  });

  it('redirects a guest from /favorites to /login', () => {
    const router = renderRoute(AppRoute.Favorites);

    expect(router.state.location.pathname).toBe(AppRoute.Login);
    expect(router.state.historyAction).toBe('REPLACE');
    expect(screen.getByRole('heading', {level: 1, name: 'Sign in'})).toBeInTheDocument();
  });

  it('renders the offer page for an id from the mocks', () => {
    renderRoute(`${AppRoute.Offer}/${offer.id}`);

    expect(screen.getByRole('heading', {level: 1, name: offer.title})).toBeInTheDocument();
    expect(document.title).toBe(`Six Cities - ${offer.title}`);
  });

  it.each(['/offer/unknown', '/abc'])('renders the 404 page at %s', (route) => {
    renderRoute(route);

    expect(screen.getByRole('heading', {level: 1})).toHaveTextContent('404 Not Found');
  });

  it('opens an offer by its card title without reloading the document', async () => {
    const user = userEvent.setup();
    const router = renderRoute(AppRoute.Main);

    await user.click(screen.getByRole('link', {name: offer.title}));

    expect(router.state.location.pathname).toBe(`${AppRoute.Offer}/${offer.id}`);
    expect(screen.getByRole('heading', {level: 1, name: offer.title})).toBeInTheDocument();
  });

  it('goes to the main page by the logo', async () => {
    const user = userEvent.setup();
    const router = renderRoute('/abc');

    await user.click(screen.getAllByRole('link', {name: 'Шесть городов - на главную'})[0]);

    expect(router.state.location.pathname).toBe(AppRoute.Main);
  });

  it('shows the error screen when a route throws', () => {
    // React и роутер пишут пойманную ошибку в консоль; в тесте этот вывод не нужен.
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    function BrokenPage(): never {
      throw new Error('Render failed');
    }
    const [root] = createAppRoutes();
    const routes: RouteObject[] = [
      {path: root.path, errorElement: root.errorElement, children: [{index: true, element: <BrokenPage />}]},
    ];

    renderRoute(AppRoute.Main, routes);

    expect(screen.getByRole('alert')).toHaveTextContent('Server is unavailable');
    expect(screen.getByRole('button', {name: 'Try again'})).toBeInTheDocument();
  });
});
