import {render, screen, waitFor} from '@testing-library/react';
import {afterEach, expect, it, vi} from 'vitest';
import {YANDEX_MAPS_URL} from '../../const';
import {offers} from '../../mocks/offers';
import {installYmaps3} from '../../mocks/ymaps3';
import Map from './map';

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

it('shows a message in the map container when the key is missing', async () => {
  vi.stubEnv('VITE_YANDEX_MAPS_KEY', '');
  const {container} = render(<Map city={offers[0].city} offers={offers} activeOfferId={null} />);
  const message = await screen.findByText('Map is unavailable');
  expect(message).toHaveClass('map__note');
  expect(message.parentElement).toBe(container.querySelector('.map'));
});

it('mounts two independent maps after loading one shared script', async () => {
  vi.stubEnv('VITE_YANDEX_MAPS_KEY', 'test-key');
  const maps = installYmaps3();
  render(
    <>
      <Map city={offers[0].city} offers={offers} activeOfferId={null} />
      <Map city={offers[0].city} offers={offers} activeOfferId={offers[0].id} />
    </>,
  );
  const scripts = document.querySelectorAll(`script[src^="${YANDEX_MAPS_URL}"]`);
  expect(scripts).toHaveLength(1);
  expect(maps).toHaveLength(0);
  scripts[0].dispatchEvent(new Event('load'));
  await waitFor(() => {
    expect(maps).toHaveLength(2);
    expect(maps[1].markers).toHaveLength(offers.length);
  });
  expect(maps[0].markers[0].element).not.toHaveClass('map__pin--active');
  expect(maps[1].markers[0].element).toHaveClass('map__pin--active');
  scripts[0].remove();
});
