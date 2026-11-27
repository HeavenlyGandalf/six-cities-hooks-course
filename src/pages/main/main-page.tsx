import {useAppDispatch, useAppSelector} from '../../hooks/use-app-store/use-app-store';
import {changeCity} from '../../store/offers/offers';
import {selectCity, selectOffers} from '../../store/offers/selectors';
import {CITY_CENTERS} from '../../mocks/cities';
import {useRef, useState, type JSX} from 'react';
import {Link} from 'react-router';
import Footer from '../../components/footer/footer';
import Header from '../../components/header/header';
import Map from '../../components/map/map';
import OffersList from '../../components/offers-list/offers-list';
import SearchField from '../../components/search-field/search-field';
import {useMediaQuery} from '../../hooks/use-media-query/use-media-query';
import {AppRoute, CITIES, DEFAULT_SORT, PHONE_MEDIA_QUERY, SORT_OPTIONS, UiText, ViewMode, type SortOption, type ViewModeValue} from '../../const';
import {stubUser} from '../../mocks/user';
import {formatPageTitle} from '../../utils/format';
import {filterByTitle, sortOffers} from '../../utils/offers';

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
  const dispatch = useAppDispatch();
  const activeCity = useAppSelector(selectCity);
  const offers = useAppSelector(selectOffers);
  const [sort, setSort] = useState<SortOption>(DEFAULT_SORT);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortTriggerRef = useRef<HTMLButtonElement>(null);
  const [previousCity, setPreviousCity] = useState(activeCity);
  if (previousCity !== activeCity) {
    setPreviousCity(activeCity);
    setActiveOfferId(null);
  }

  // Список пропадает и по клику «Map», и при сужении до телефона с выбранной картой.
  // Поле поиска размонтируется вместе со списком и отменяет ожидающий поиск,
  // поэтому набранный текст применяется сразу: после «List» поле и список совпадают.
  // Активная карточка сбрасывается: курсор больше не над списком, карта не должна подсвечивать маркер.
  // Состояние правится прямо в рендере при смене isListShown, без эффекта: React перерисует сразу.
  const [wasListShown, setWasListShown] = useState(isListShown);
  if (wasListShown !== isListShown) {
    setWasListShown(isListShown);
    if (!isListShown) {
      setSearchQuery(searchText);
      setActiveOfferId(null);
    }
  }
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
                      to={AppRoute.Main}
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
                  <SearchField value={searchText} onValueChange={setSearchText} onSearch={setSearchQuery} />
                  <div className={`sort${isSortOpen ? ' sort--opened' : ''}`}>
                    <span className="sort__caption" id="sort-caption">{UiText.SortBy}</span>
                    <button
                      className="sort__current"
                      ref={sortTriggerRef}
                      type="button"
                      aria-haspopup="listbox"
                      aria-expanded={isSortOpen}
                      onClick={() => {
                        setIsSortOpen(!isSortOpen);
                      }}
                      aria-labelledby="sort-caption sort-current"
                    >
                      <span id="sort-current">{sort}</span>
                      <svg className="sort__arrow" aria-hidden="true"><use href="#icon-arrow" /></svg>
                    </button>
                    <ul className="sort__list" hidden={!isSortOpen} role="listbox" aria-labelledby="sort-caption">
                      {SORT_OPTIONS.map((option) => {
                        const isActive = option === sort;
                        return (
                          <li
                            key={option}
                            className={`sort__option${isActive ? ' sort__option--active' : ''}`}
                            role="option"
                            aria-selected={isActive}
                            tabIndex={0}
                            onClick={() => {
                              setSort(option);
                              setIsSortOpen(false);
                            }}
                            onKeyDown={(event) => {
                              if (event.key === 'Enter' || event.key === ' ') {
                                event.preventDefault();
                                setSort(option);
                                setIsSortOpen(false);
                                sortTriggerRef.current?.focus();
                              }
                            }}
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
