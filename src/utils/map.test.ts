import {expect, it} from 'vitest';
import {toLngLat} from './map';

it('puts longitude before latitude for Yandex Maps', () => {
  expect(toLngLat({latitude: 48, longitude: 2})).toEqual([2, 48]);
});
