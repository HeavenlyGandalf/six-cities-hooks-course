import {act, renderHook} from '@testing-library/react';
import type {PropsWithChildren} from 'react';
import {Provider} from 'react-redux';
import {expect, it} from 'vitest';
import {changeCity} from '../../store/offers/offers';
import {selectCity} from '../../store/offers/selectors';
import {createStore} from '../../store/store';
import {useAppDispatch, useAppSelector} from './use-app-store';

it('dispatches to the provided store and subscribes to its selected city', () => {
  const store = createStore();
  function Wrapper({children}: PropsWithChildren) {
    return <Provider store={store}>{children}</Provider>;
  }
  const {result} = renderHook(() => ({city: useAppSelector(selectCity), dispatch: useAppDispatch()}), {wrapper: Wrapper});
  expect(result.current.city).toBe('Paris');
  act(() => {
    result.current.dispatch(changeCity('Hamburg'));
  });
  expect(result.current.city).toBe('Hamburg');
});
