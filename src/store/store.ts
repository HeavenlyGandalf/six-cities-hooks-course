import {configureStore} from '@reduxjs/toolkit';
import {NameSpace} from '../const';
import {offersSlice} from './offers/offers';

export function createStore() {
  return configureStore({reducer: {[NameSpace.Offers]: offersSlice.reducer}});
}

export type AppStore = ReturnType<typeof createStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
