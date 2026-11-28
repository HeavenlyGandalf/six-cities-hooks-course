import {useAppDispatch, useAppSelector} from '../../hooks/use-app-store/use-app-store';
import {changeCity} from '../../store/offers/offers';
import {selectCity, selectOffers} from '../../store/offers/selectors';
import {CITY_CENTERS} from '../../mocks/cities';
import {useEffect, useState, type JSX} from 'react';
import {Link, NavigationType, useLocation, useNavigationType} from 'react-router';
import Footer from '../../components/footer/footer';
import Header from '../../components/header/header';
import Map from '../../components/map/map';
import OffersList from '../../components/offers-list/offers-list';
import SearchField from '../../components/search-field/search-field';
import SortMenu from '../../components/sort-menu/sort-menu';
import {useMediaQuery} from '../../hooks/use-media-query/use-media-query';
import {AppRoute, CITIES, PHONE_MEDIA_QUERY, RESET_SEARCH_NAVIGATION, SortCode, UiText, UrlParam, ViewMode, type ViewModeValue} from '../../const';
import {stubUser} from '../../mocks/user';
import {formatPageTitle} from '../../utils/format';
import {filterByTitle, sortOffers} from '../../utils/offers';
import {useUrlState} from '../../hooks/use-url-state/use-url-state';
import {parseQuery, parseSort, parseSortCode, serializeSort} from '../../utils/url-state';

// На телефоне переключатель List/Map монтирует только выбранный вид (H12); id радио остались,
// чтобы стили вёрстки (:has(#view-map:checked) в pages/main.css) работали как раньше.
// Вид хранится и на планшете: при возврате на телефон выбор не сбрасывается.
function MainPage(): JSX.Element {
  const [activeOfferId, setActiveOfferId] = useState<string | null>(null);
  // searchText - что набрано в поле, searchQuery - строка, уже применённая к списку после задержки.
  const location = useLocation();
  const navigationType = useNavigationType();
  const [searchQuery, setSearchQuery] = useUrlState(UrlParam.Query, '', parseQuery);
  const [sortCode, setSortCode] = useUrlState(UrlParam.Sort, SortCode.Popular, parseSortCode);
  const sort = parseSort(sortCode);
  const applySearch = (query: string) => {
    setSearchQuery(query, {replace: true});
  };
  const [searchText, setSearchText] = useState(searchQuery);
  const [previousLocationKey, setPreviousLocationKey] = useState(location.key);
  const [searchResetKey, setSearchResetKey] = useState(0);
  const [previousQuery, setPreviousQuery] = useState(searchQuery);
  if (previousLocationKey !== location.key) {
    setPreviousLocationKey(location.key);
    setPreviousQuery(searchQuery);
    // Сортировка сохраняет черновик; переход к другому q восстанавливает поле.
    if (navigationType === NavigationType.Pop || location.state === RESET_SEARCH_NAVIGATION || previousQuery !== searchQuery && searchText !== searchQuery) {
      setSearchText(searchQuery);
      setSearchResetKey(searchResetKey + 1);
    }
  }
  const [viewMode, setViewMode] = useState<ViewModeValue>(ViewMode.List);
  const isPhone = useMediaQuery(PHONE_MEDIA_QUERY);
  const isListShown = !isPhone || viewMode === ViewMode.List;
  const isMapShown = !isPhone || viewMode === ViewMode.Map;
  const dispatch = useAppDispatch();
  const activeCity = useAppSelector(selectCity);
  const offers = useAppSelector(selectOffers);
  const [previousCity, setPreviousCity] = useState(activeCity);
  if (previousCity !== activeCity) {
    setPreviousCity(activeCity);
    setActiveOfferId(null);
  }

  // Список пропадает и по клику «Map», и при сужении до телефона с выбранной картой.
  // Поле поиска размонтируется вместе со списком и отменяет ожидающий поиск,
  // поэтому набранный текст применяется сразу: после «List» поле и список совпадают.
  // Активная карточка сбрасывается: курсор больше не над списком, карта не должна подсвечивать маркер.
  // Подсветка сбрасывается при смене вида; запись URL выполняется после рендера.
  const [wasListShown, setWasListShown] = useState(isListShown);
  if (wasListShown !== isListShown) {
    setWasListShown(isListShown);
    if (!isListShown) {
      setActiveOfferId(null);
    }
  }
  useEffect(() => {
    if (!isListShown && searchText !== searchQuery) {
      setSearchQuery(searchText, {replace: true});
    }
  }, [isListShown, searchText, searchQuery, setSearchQuery]);
  const cityOffers = offers.filter((offer) => offer.city.name === activeCity);
  // При непустом поиске заголовок считает найденные предложения (FR-2).
  const foundOffers = sortOffers(filterByTitle(cityOffers, searchQuery), sort);
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
                      to={{pathname: AppRoute.Main, search: location.search}}
                      onClick={(event) => {
                        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) {
                          return;
                        }
                        dispatch(changeCity(city));
                      }}
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
                onChange={() => {
                  setViewMode(ViewMode.Map);
                }}
              />
              <label className="view-switch__label" htmlFor="view-map">{UiText.ViewMap}</label>
            </div>
          )}

          {isMapShown && (
            <section className="places-layout__map" aria-label={UiText.MapLabel}>
              <Map city={CITY_CENTERS[activeCity]} offers={foundOffers} activeOfferId={activeOfferId} />
            </section>
          )}

          {isListShown && (
            <section className="places places-layout__list">
              <div className="places__head">
                <h2 className="places__title">
                  {foundOffers.length} {UiText.PlacesToStayIn} {activeCity}
                </h2>
                <div className="places__tools">
                  <SearchField key={searchResetKey} value={searchText} onValueChange={setSearchText} onSearch={applySearch} />
                  <SortMenu
                    sort={sort} onSortChange={(value) => {
                      setSortCode(serializeSort(value));
                    }}
                  />
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
