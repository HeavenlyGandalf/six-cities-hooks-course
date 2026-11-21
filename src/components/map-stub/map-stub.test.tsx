import {render} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import MapStub from './map-stub';

describe('MapStub', () => {
  it('shows one blue pin per near offer and one orange pin for the current offer', () => {
    const {container} = render(<MapStub pinCount={3} />);

    expect(container.querySelectorAll('.map__pin:not(.map__pin--active)')).toHaveLength(3);
    expect(container.querySelectorAll('.map__pin--active')).toHaveLength(1);
  });

  it('shows fewer blue pins when there are fewer near offers', () => {
    const {container} = render(<MapStub pinCount={1} />);

    expect(container.querySelectorAll('.map__pin:not(.map__pin--active)')).toHaveLength(1);
  });

  it('keeps the note about Yandex Maps', () => {
    const {container} = render(<MapStub pinCount={3} />);

    expect(container.querySelector('.map__note')).toHaveTextContent('Здесь - Яндекс Карты');
  });
});
