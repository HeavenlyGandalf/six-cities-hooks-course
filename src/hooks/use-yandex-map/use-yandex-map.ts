import type {YMap} from '@yandex/ymaps3-types';
import {useEffect, useRef, useState, type RefObject} from 'react';
import {loadYandexMaps} from '../../services/yandex-maps';
import type {City, OfferPreview} from '../../types/offer';
import {toLngLat} from '../../utils/map';

export type MapOffer = Pick<OfferPreview, 'id' | 'location'>;
type MapState = {status: 'loading' | 'error'} | {status: 'ready'; map: YMap};

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

function createPin(active: boolean): HTMLElement {
  const element = document.createElement('span');
  element.className = active ? 'map__pin map__pin--active' : 'map__pin';
  const svg = document.createElementNS(SVG_NAMESPACE, 'svg');
  svg.setAttribute('aria-hidden', 'true');
  const use = document.createElementNS(SVG_NAMESPACE, 'use');
  use.setAttribute('href', '#icon-pin');
  svg.append(use);
  element.append(svg);
  return element;
}

export function useYandexMap(
  containerRef: RefObject<HTMLElement | null>,
  city: City,
  offers: readonly MapOffer[],
  activeOfferId: string | null,
): MapState['status'] {
  const initialCityRef = useRef(city);
  const liveMapRef = useRef<YMap | null>(null);
  const [state, setState] = useState<MapState>({status: 'loading'});
  const {longitude, latitude, zoom} = city.location;

  useEffect(() => {
    let cancelled = false;
    void loadYandexMaps().then((api) => {
      if (cancelled || !containerRef.current) {
        return;
      }
      const location = initialCityRef.current.location;
      const map = new api.YMap(containerRef.current, {location: {center: toLngLat(location), zoom: location.zoom}});
      liveMapRef.current = map;
      map.addChild(new api.YMapDefaultSchemeLayer({}));
      map.addChild(new api.YMapDefaultFeaturesLayer({}));
      setState({status: 'ready', map});
    }).catch(() => {
      if (!cancelled) {
        liveMapRef.current?.destroy();
        liveMapRef.current = null;
        setState({status: 'error'});
      }
    });
    return () => {
      cancelled = true;
      liveMapRef.current?.destroy();
      liveMapRef.current = null;
    };
  }, [containerRef]);

  useEffect(() => {
    if (state.status === 'ready') {
      state.map.update({location: {center: toLngLat({longitude, latitude}), zoom}});
    }
  }, [state, longitude, latitude, zoom]);

  useEffect(() => {
    if (state.status !== 'ready') {
      return undefined;
    }
    const {map} = state;
    const markers = offers.map(({id, location}) => {
      const active = id === activeOfferId;
      const marker = new ymaps3.YMapMarker({coordinates: toLngLat(location), zIndex: Number(active)}, createPin(active));
      map.addChild(marker);
      return marker;
    });
    return () => {
      // destroy уже снял дочерние объекты при размонтировании карты.
      if (liveMapRef.current === map) {
        markers.forEach((marker) => map.removeChild(marker));
      }
    };
  }, [state, offers, activeOfferId]);

  return state.status;
}
