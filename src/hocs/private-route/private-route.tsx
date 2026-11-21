import type {JSX, ReactNode} from 'react';
import {Navigate} from 'react-router';
import {AppRoute, AuthStatus, type AuthStatusValue, UiText} from '../../const';

// private - только для вошедшего (/favorites), guest - только для гостя (/login).
export type PrivateRouteMode = 'private' | 'guest';

interface PrivateRouteProps {
  // Статус приходит снаружи: сейчас заглушка, в эпике 7 - значение из store.
  authStatus: AuthStatusValue;
  mode: PrivateRouteMode;
  children: ReactNode;
}

function PrivateRoute({authStatus, mode, children}: PrivateRouteProps): JSX.Element {
  if (authStatus === AuthStatus.Unknown) {
    return (
      <div className="loader" role="status">
        <span className="spinner" aria-hidden="true" />
        <span className="loader__text">{UiText.Loading}</span>
      </div>
    );
  }

  if (mode === 'private' && authStatus === AuthStatus.NoAuth) {
    return <Navigate to={AppRoute.Login} replace />;
  }

  if (mode === 'guest' && authStatus === AuthStatus.Auth) {
    return <Navigate to={AppRoute.Main} replace />;
  }

  return <>{children}</>;
}

export default PrivateRoute;
