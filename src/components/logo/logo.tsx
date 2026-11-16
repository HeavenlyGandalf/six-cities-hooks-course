import type {JSX} from 'react';
import {AppRoute, UiText} from '../../const';

// Размер знака логотипа из вёрстки, px.
const LOGO_MARK_SIZE = 32;

function Logo(): JSX.Element {
  return (
    <a className="logo" href={AppRoute.Main} aria-label={UiText.LogoLabel}>
      <img className="logo__mark" src="/img/logo.svg" width={LOGO_MARK_SIZE} height={LOGO_MARK_SIZE} alt="" />
      <span className="logo__text">six<span>cities</span></span>
    </a>
  );
}

export default Logo;
