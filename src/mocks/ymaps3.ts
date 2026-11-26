import type {LngLat, YMapProps} from '@yandex/ymaps3-types';
import {vi} from 'vitest';

class MockMarker {
  readonly coordinates: LngLat;
  readonly element: HTMLElement;

  constructor({coordinates}: {coordinates: LngLat}, element: HTMLElement) {
    this.coordinates = coordinates;
    this.element = element;
  }
}

export function installYmaps3(ready = Promise.resolve()) {
  const maps: MockMap[] = [];
  class MockMap {
    readonly props: YMapProps;
    readonly children = new Set<object>();
    readonly addChild = vi.fn((child: object) => this.children.add(child));
    readonly removeChild = vi.fn((child: object) => this.children.delete(child));
    readonly update = vi.fn();
    readonly destroy = vi.fn(() => {
      this.children.clear();
    });

    constructor(_container: HTMLElement, props: YMapProps) {
      this.props = props;
      maps.push(this);
    }

    get markers() {
      return [...this.children].filter((child) => child instanceof MockMarker);
    }
  }
  vi.stubGlobal('ymaps3', {
    ready,
    YMap: MockMap,
    YMapMarker: MockMarker,
    YMapDefaultSchemeLayer: vi.fn(),
    YMapDefaultFeaturesLayer: vi.fn(),
  });
  return maps;
}
