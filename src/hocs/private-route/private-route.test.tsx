import {render, screen} from '@testing-library/react';
import {createMemoryRouter} from 'react-router';
import {RouterProvider} from 'react-router/dom';
import {describe, expect, it} from 'vitest';
import {AppRoute, AuthStatus, type AuthStatusValue} from '../../const';
import PrivateRoute, {type PrivateRouteMode} from './private-route';

const PROTECTED_PATH = '/protected';

// Маршрут с HOC и две цели редиректа, чтобы видеть, куда ушёл переход.
function renderPrivateRoute(authStatus: AuthStatusValue, mode: PrivateRouteMode) {
  const router = createMemoryRouter(
    [
      {
        path: PROTECTED_PATH,
        element: <PrivateRoute authStatus={authStatus} mode={mode}><p>Protected content</p></PrivateRoute>,
      },
      {path: AppRoute.Login, element: <p>Login page</p>},
      {path: AppRoute.Main, element: <p>Main page</p>},
    ],
    {initialEntries: [AppRoute.Main, PROTECTED_PATH], initialIndex: 1},
  );
  render(<RouterProvider router={router} />);
  return router;
}

describe('PrivateRoute', () => {
  it.each<PrivateRouteMode>(['private', 'guest'])('shows a loader while the status is unknown (%s)', (mode) => {
    renderPrivateRoute(AuthStatus.Unknown, mode);

    expect(screen.getByRole('status')).toHaveClass('loader');
    expect(screen.getByRole('status')).toHaveTextContent('Loading…');
    expect(screen.queryByText('Protected content')).not.toBeInTheDocument();
  });

  it('redirects a guest from a private route to /login with replace', () => {
    const router = renderPrivateRoute(AuthStatus.NoAuth, 'private');

    expect(screen.getByText('Login page')).toBeInTheDocument();
    expect(router.state.location.pathname).toBe(AppRoute.Login);
    expect(router.state.historyAction).toBe('REPLACE');
  });

  it('shows a private route to a signed-in user', () => {
    renderPrivateRoute(AuthStatus.Auth, 'private');

    expect(screen.getByText('Protected content')).toBeInTheDocument();
  });

  it('redirects a signed-in user from a guest route to the main page with replace', () => {
    const router = renderPrivateRoute(AuthStatus.Auth, 'guest');

    expect(screen.getByText('Main page')).toBeInTheDocument();
    expect(router.state.location.pathname).toBe(AppRoute.Main);
    expect(router.state.historyAction).toBe('REPLACE');
  });

  it('shows a guest route to a guest', () => {
    renderPrivateRoute(AuthStatus.NoAuth, 'guest');

    expect(screen.getByText('Protected content')).toBeInTheDocument();
  });
});
