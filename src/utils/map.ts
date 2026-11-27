import type {LngLat} from '@yandex/ymaps3-types';
import type {Location} from '../types/offer';

export function toLngLat({longitude, latitude}: Pick<Location, 'longitude' | 'latitude'>): LngLat {
  return [longitude, latitude];
}
