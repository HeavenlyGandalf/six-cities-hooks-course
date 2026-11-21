import {useState, type JSX} from 'react';
import {Link} from 'react-router';
import Footer from '../../components/footer/footer';
import Header from '../../components/header/header';
import OffersList from '../../components/offers-list/offers-list';
import SearchField from '../../components/search-field/search-field';
import {useMediaQuery} from '../../hooks/use-media-query/use-media-query';
import {AppRoute, CITIES, DEFAULT_CITY, DEFAULT_SORT, PHONE_MEDIA_QUERY, SORT_OPTIONS, UiText, ViewMode, type ViewModeValue} from '../../const';
import {offers} from '../../mocks/offers';
import {stubUser} from '../../mocks/user';
import {formatPageTitle} from '../../utils/format';
import {filterByTitle} from '../../utils/offers';

// Город и сортировка пока зафиксированы: ссылки городов ведут на главную,
// выбор города и сортировка появятся вместе со store.
// Активная карточка - локальное состояние страницы, позже её получит карта (H5).
// Строка поиска приходит из SearchField уже с задержкой; на этапе 6 она переедет в адрес (H4).
// На телефоне переключатель List/Map монтирует только выбранный вид (H12); id радио остались,
// чтобы стили вёрстки (:has(#view-map:checked) в pages/main.css) работали как раньше.
// Вид хранится и на планшете: при возврате на телефон выбор не сбрасывается.
function MainPage(): JSX.Element {
  const [activeOfferId, setActiveOfferId] = useState<string | null>(null);
  // searchText - что набрано в поле, searchQuery - строка, уже применённая к списку после задержки.
  const [searchText, setSearchText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewModeValue>(ViewMode.List);
  const isPhone = useMediaQuery(PHONE_MEDIA_QUERY);
  const isListShown = !isPhone || viewMode === ViewMode.List;
  const isMapShown = !isPhone || viewMode === ViewMode.Map;
  const activeCity = DEFAULT_CITY;

  // Поле поиска размонтируется вместе со списком и отменяет ожидающий поиск,
  // поэтому набранный текст применяется сразу: после «List» поле и список совпадают.
  const handleMapChoose = () => {
    setSearchQuery(searchText);
    setViewMode(ViewMode.Map);
  };
  const cityOffers = offers.filter((offer) => offer.city.name === activeCity);
  // При непустом поиске заголовок считает найденные предложения (FR-2).
  const foundOffers = filterByTitle(cityOffers, searchQuery);
  const favoriteCount = offers.filter((offer) => offer.isFavorite).length;

  return (
    <div className="page">
      <title>{formatPageTitle(activeCity)}</title>
      <Header user={stubUser} favoriteCount={favoriteCount} />

      <main className="page__main">
        <h1 className="visually-hidden">{UiText.CitiesHeading}</h1>
        <nav className="cities" aria-label={UiText.CitiesLabel}>
          <div className="container">
            <ul className="cities__list">
              {CITIES.map((city) => {
                const isActive = city === activeCity;
                return (
                  <li key={city}>
                    <Link
                      className={`cities__link${isActive ? ' cities__link--active' : ''}`}
                      to={AppRoute.Main}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {city}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        <div className="container places-layout">
          {isPhone && (
            <div className="view-switch" role="radiogroup" aria-label={UiText.ViewLabel}>
              <input
                className="view-switch__input"
                type="radio"
                name="view"
                id="view-list"
                checked={viewMode === ViewMode.List}
                onChange={() => {
                  setViewMode(ViewMode.List);
                }}
              />
              <label className="view-switch__label" htmlFor="view-list">{UiText.ViewList}</label>
              <input
                className="view-switch__input"
                type="radio"
                name="view"
                id="view-map"
                checked={viewMode === ViewMode.Map}
                onChange={handleMapChoose}
              />
              <label className="view-switch__label" htmlFor="view-map">{UiText.ViewMap}</label>
            </div>
          )}

          {/* Заглушка карты без маркеров: Яндекс Карты подключаются в H5. */}
          {isMapShown && (
            <section className="places-layout__map" aria-label={UiText.MapLabel}>
              <div className="map">
                <span className="map__note">{UiText.MapNote}</span>
              </div>
            </section>
          )}

          {isListShown && (
            <section className="places places-layout__list">
              <div className="places__head">
                <h2 className="places__title">
                  {foundOffers.length} {UiText.PlacesToStayIn} {activeCity}
                </h2>
                <div className="places__tools">
                  <SearchField value={searchText} onValueChange={setSearchText} onSearch={setSearchQuery} />
                  <div className="sort">
                    <span className="sort__caption" id="sort-caption">{UiText.SortBy}</span>
                    <button
                      className="sort__current"
                      type="button"
                      aria-haspopup="listbox"
                      aria-expanded="false"
                      aria-labelledby="sort-caption sort-current"
                    >
                      <span id="sort-current">{DEFAULT_SORT}</span>
                      <svg className="sort__arrow" aria-hidden="true"><use href="#icon-arrow" /></svg>
                    </button>
                    <ul className="sort__list" role="listbox" aria-labelledby="sort-caption">
                      {SORT_OPTIONS.map((option) => {
                        const isActive = option === DEFAULT_SORT;
                        return (
                          <li
                            key={option}
                            className={`sort__option${isActive ? ' sort__option--active' : ''}`}
                            role="option"
                            aria-selected={isActive}
                          >
                            {option}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>

              <OffersList offers={foundOffers} activeOfferId={activeOfferId} onCardHover={setActiveOfferId} />
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default MainPage;
