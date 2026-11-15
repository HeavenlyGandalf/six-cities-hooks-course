import type {JSX} from 'react';
import {UiText} from '../../const';
import Logo from '../logo/logo';

function Footer(): JSX.Element {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <Logo />
        <p>{UiText.FooterNote}</p>
      </div>
    </footer>
  );
}

export default Footer;
