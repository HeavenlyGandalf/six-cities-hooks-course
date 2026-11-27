import {NameSpace} from '../../const';
import type {RootState} from '../store';

export const selectCity = (state: RootState) => state[NameSpace.Offers].city;
export const selectOffers = (state: RootState) => state[NameSpace.Offers].offers;
