import {createSlice, type PayloadAction} from '@reduxjs/toolkit';
import {DEFAULT_CITY, NameSpace, type CityName} from '../../const';
import type {OfferPreview} from '../../types/offer';

interface OffersState {
  city: CityName;
  offers: OfferPreview[];
}

const initialState: OffersState = {city: DEFAULT_CITY, offers: []};

export const offersSlice = createSlice({
  name: NameSpace.Offers,
  initialState,
  reducers: {
    changeCity(state, action: PayloadAction<CityName>) {
      state.city = action.payload;
    },
    fillOffers(state, action: PayloadAction<OfferPreview[]>) {
      state.offers = action.payload;
    },
  },
});

export const {changeCity, fillOffers} = offersSlice.actions;
