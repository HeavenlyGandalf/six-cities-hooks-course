import type {JSX} from 'react';
import {Link} from 'react-router';
import {AppRoute, UiText} from '../../const';
import type {AuthInfo} from '../../types/user';
import Logo from '../logo/logo';

interface HeaderProps {
  user: AuthInfo | null;
  favoriteCount: number;
  // true на странице входа: ссылка Sign in отмечается текущей (course/markup/login.html).
  isSignInCurrent?: boolean;
}

// Размер аватара в шапке из вёрстки, px.
const AVATAR_SIZE = 32;

function Header({user, favoriteCount, isSignInCurrent = false}: HeaderProps): JSX.Element {
  return (
    <header className="header">
      <div className="container header__inner">
        <Logo />
        <nav className="user-nav" aria-label={UiText.UserNavLabel}>
          {user ? (
            <>
              {/* С планшета email сокращается многоточием (main.css), на телефоне скрыт; title показывает адрес целиком (ОВ-6). */}
              <Link className="user-nav__link" to={AppRoute.Favorites} title={user.email}>
                <img className="user-nav__avatar" src={user.avatarUrl} width={AVATAR_SIZE} height={AVATAR_SIZE} alt="" />
                <span className="user-nav__email">{user.email}</span>
                <span className="user-nav__count" aria-label={`${UiText.FavoriteCountLabel} ${String(favoriteCount)}`}>
                  {favoriteCount}
                </span>
              </Link>
              <Link className="user-nav__link user-nav__link--signout" to={AppRoute.Main}>
                <span className="user-nav__label">{UiText.SignOut}</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M8 4H4v12h4M12 6l4 4-4 4M16 10H8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </>
          ) : (
            <Link className="user-nav__link" to={AppRoute.Login} aria-current={isSignInCurrent ? 'page' : undefined}>
              {UiText.SignIn}
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
