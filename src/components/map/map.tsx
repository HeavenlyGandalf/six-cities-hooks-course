import {useRef, type JSX} from 'react';
import {UiText} from '../../const';
import {useYandexMap, type MapOffer} from '../../hooks/use-yandex-map/use-yandex-map';
import type {City} from '../../types/offer';

interface MapProps {
  city: City;
  offers: readonly MapOffer[];
  activeOfferId: string | null;
}

function Map({city, offers, activeOfferId}: MapProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const status = useYandexMap(containerRef, city, offers, activeOfferId);

  return (
    <div className="map" ref={containerRef}>
      {status === 'error' && <p className="map__note">{UiText.MapUnavailable}</p>}
    </div>
  );
}

export default Map;
