import type {JSX} from 'react';
import {Link} from 'react-router';
import {AppRoute, RESET_SEARCH_NAVIGATION, UiText} from '../../const';

// Размер знака логотипа из вёрстки, px.
const LOGO_MARK_SIZE = 32;

function Logo(): JSX.Element {
  return (
    <Link className="logo" to={AppRoute.Main} state={RESET_SEARCH_NAVIGATION} aria-label={UiText.LogoLabel}>
      <img className="logo__mark" src="/img/logo.svg" width={LOGO_MARK_SIZE} height={LOGO_MARK_SIZE} alt="" />
      <span className="logo__text">six<span>cities</span></span>
    </Link>
  );
}

export default Logo;
