import type {JSX} from 'react';
import Footer from '../../components/footer/footer';
import Header from '../../components/header/header';
import {AppRoute, DEFAULT_CITY, LOGIN_CITY_IMAGE, UiText} from '../../const';

// Размеры фото города из вёрстки (course/markup/login.html).
const CityImageSize = {
  Width: 800,
  Height: 600,
} as const;

// Этап 2 статичный: форма в чистом состоянии без обработчиков, город фиксированный.
// Отправка и проверка пароля - история 7.2, случайный город - там же.
function LoginPage(): JSX.Element {
  return (
    <div className="page">
      <Header user={null} favoriteCount={0} isSignInCurrent />

      <main className="page__main">
        <div className="container login">
          <section className="login__panel" aria-labelledby="login-title">
            <h1 className="login__title" id="login-title">{UiText.SignIn}</h1>

            <form className="login__form" action="#" method="post" noValidate>
              <div className="login__group">
                <label className="login__label" htmlFor="login-email">{UiText.EmailLabel}</label>
                <input
                  className="field"
                  id="login-email"
                  type="email"
                  name="email"
                  placeholder={UiText.EmailPlaceholder}
                  autoComplete="email"
                  required
                />
              </div>

              <div className="login__group">
                <label className="login__label" htmlFor="login-password">{UiText.PasswordLabel}</label>
                <input
                  className="field"
                  id="login-password"
                  type="password"
                  name="password"
                  placeholder={UiText.PasswordPlaceholder}
                  autoComplete="current-password"
                  required
                  aria-describedby="login-password-hint"
                />
                <p className="login__hint" id="login-password-hint">{UiText.PasswordHint}</p>
              </div>

              <button className="button login__submit" type="submit">{UiText.SignIn}</button>
            </form>
          </section>

          <a className="login__city" href={AppRoute.Main}>
            <img
              className="login__city-image"
              src={LOGIN_CITY_IMAGE}
              width={CityImageSize.Width}
              height={CityImageSize.Height}
              alt=""
            />
            <span className="login__city-text">
              <span className="login__city-caption">{UiText.Explore}</span>
              <span className="login__city-name">{DEFAULT_CITY}</span>
            </span>
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default LoginPage;
