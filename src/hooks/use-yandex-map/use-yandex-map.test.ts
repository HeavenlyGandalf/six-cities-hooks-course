import {act, renderHook, waitFor} from '@testing-library/react';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {offers} from '../../mocks/offers';
import {installYmaps3} from '../../mocks/ymaps3';
import type {City} from '../../types/offer';
import {toLngLat} from '../../utils/map';
import {useYandexMap} from './use-yandex-map';

vi.mock('../../services/yandex-maps', () => ({
  loadYandexMaps: async () => {
    await ymaps3.ready;
    return ymaps3;
  },
}));

const city = offers[0].city;
const containerRef = {current: document.createElement('div')};
const initialProps: {city: City; active: string | null; offers: typeof offers} = {city, active: null, offers};

function renderMap(strict = false) {
  return renderHook((props) => useYandexMap(containerRef, props.city, props.offers, props.active), {
    initialProps,
    reactStrictMode: strict,
  });
}

describe('useYandexMap', () => {
  let maps: ReturnType<typeof installYmaps3>;
  beforeEach(() => {
    maps = installYmaps3();
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('creates a map with city center, base layers and offer markers', async () => {
    const {result} = renderMap();
    expect(result.current).toBe('loading');
    await waitFor(() => {
      expect(result.current).toBe('ready');
    });
    expect(maps).toHaveLength(1);
    expect(maps[0].props.location).toEqual({center: toLngLat(city.location), zoom: city.location.zoom});
    expect(maps[0].children.size).toBe(offers.length + 2);
    expect(maps[0].markers.map((marker) => marker.coordinates)).toEqual(offers.map((offer) => toLngLat(offer.location)));
    expect(maps[0].markers.every(({element}) => element.className === 'map__pin')).toBe(true);
  });

  it('replaces markers when the selection or filtered offers change', async () => {
    const {result, rerender} = renderMap();
    await waitFor(() => {
      expect(result.current).toBe('ready');
    });
    const map = maps[0];
    const previousMarkers = map.markers;
    rerender({...initialProps, active: offers[0].id});
    previousMarkers.forEach((marker) => {
      expect(map.removeChild).toHaveBeenCalledWith(marker);
    });
    expect(map.markers[0].element).toHaveClass('map__pin--active');
    rerender({...initialProps, active: offers[1].id});
    expect(map.markers[0].element).not.toHaveClass('map__pin--active');
    expect(map.markers[1].element).toHaveClass('map__pin--active');
    rerender({...initialProps, offers: []});
    expect(map.markers).toHaveLength(0);
    expect(maps).toHaveLength(1);
  });

  it('moves the existing map to a new city', async () => {
    const {result, rerender} = renderMap();
    await waitFor(() => {
      expect(result.current).toBe('ready');
    });
    const nextCity = {name: 'Hamburg', location: {latitude: 53, longitude: 10, zoom: 12}};
    rerender({...initialProps, city: nextCity});
    expect(maps[0].update).toHaveBeenCalledWith({location: {center: [10, 53], zoom: 12}});
    expect(maps).toHaveLength(1);
  });

  it('keeps one live map in StrictMode and destroys it on unmount', async () => {
    const {result, unmount} = renderMap(true);
    await waitFor(() => {
      expect(result.current).toBe('ready');
    });
    expect(maps).toHaveLength(1);
    unmount();
    expect(maps[0].destroy).toHaveBeenCalledTimes(1);
  });

  it('skips creation if unmounted before the API becomes ready', async () => {
    const {unmount} = renderMap();
    unmount();
    await act(async () => {
      await Promise.resolve();
    });
    expect(maps).toHaveLength(0);
  });

  it('reports a loader failure', async () => {
    maps = installYmaps3(Promise.reject(new Error('Unavailable')));
    const {result} = renderMap();
    await waitFor(() => {
      expect(result.current).toBe('error');
    });
    expect(maps).toHaveLength(0);
  });
});
