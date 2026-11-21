import type {JSX} from 'react';
import {UiText} from '../../const';
import {formatPageTitle} from '../../utils/format';

interface ErrorScreenProps {
  // По умолчанию «Try again» перезагружает страницу; тест подставляет свою функцию.
  onRetry?: () => void;
}

function reloadPage(): void {
  window.location.reload();
}

// Блок «Сервер недоступен» из course/markup/states.html. Показывается вместо любой страницы,
// поэтому это компонент, а не страница со своим адресом.
function ErrorScreen({onRetry = reloadPage}: ErrorScreenProps): JSX.Element {
  return (
    <div className="page">
      <title>{formatPageTitle(UiText.ServerErrorTitle)}</title>
      <main className="page__main">
        <div className="container">
          <div className="empty" role="alert">
            <svg className="empty__image server-art" viewBox="0 0 160 160" aria-hidden="true">
              <circle className="server-art__bg" cx="80" cy="80" r="64" />
              <rect className="server-art__unit" x="44" y="48" width="72" height="24" rx="6" />
              <rect className="server-art__unit" x="44" y="80" width="72" height="24" rx="6" />
              <circle className="server-art__led" cx="56" cy="60" r="4" />
              <circle className="server-art__led server-art__led--error" cx="56" cy="92" r="4" />
              <path className="server-art__slot" d="M70 60h32M70 92h32" />
              <path className="server-art__cross" d="m98 112 16 16m0-16-16 16" />
            </svg>
            <h1 className="empty__title">{UiText.ServerErrorTitle}</h1>
            <p className="empty__text">{UiText.ServerErrorText}</p>
            <button className="button" type="button" onClick={onRetry}>{UiText.TryAgain}</button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ErrorScreen;
