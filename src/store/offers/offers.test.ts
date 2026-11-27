import {describe, expect, it} from 'vitest';
import {offers} from '../../mocks/offers';
import {createStore} from '../store';
import {changeCity, fillOffers} from './offers';
import {selectCity, selectCityOffers, selectOffers} from './selectors';

describe('offers store', () => {
  it('starts in Paris with an empty list and ignores unknown actions', () => {
    const store = createStore();
    const initialState = store.getState();
    store.dispatch({type: 'unknown'});
    expect(store.getState()).toBe(initialState);
    expect(selectCity(initialState)).toBe('Paris');
    expect(selectOffers(initialState)).toEqual([]);
  });

  it('replaces offers, selects within a city and keeps stores independent', () => {
    const store = createStore();
    const otherStore = createStore();
    store.dispatch(fillOffers(offers));
    expect(selectCityOffers(store.getState())).toEqual(offers);
    store.dispatch(changeCity('Amsterdam'));
    expect(selectCity(store.getState())).toBe('Amsterdam');
    expect(selectCityOffers(store.getState())).toEqual([]);
    store.dispatch(fillOffers(offers.slice(0, 1)));
    expect(selectOffers(store.getState())).toEqual(offers.slice(0, 1));
    expect(selectOffers(otherStore.getState())).toEqual([]);
    expect(selectCity(otherStore.getState())).toBe('Paris');
  });
});
