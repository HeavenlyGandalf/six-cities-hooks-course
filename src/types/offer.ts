import type {Host} from './user';

export interface Location {
  latitude: number;
  longitude: number;
  zoom: number;
}

export interface City {
  name: string;
  location: Location;
}

export type OfferType = 'apartment' | 'room' | 'house' | 'hotel';

export interface OfferPreview {
  id: string;
  title: string;
  type: OfferType;
  price: number;
  previewImage: string;
  city: City;
  location: Location;
  isFavorite: boolean;
  isPremium: boolean;
  rating: number;
}

export type Offer = Omit<OfferPreview, 'previewImage'> & {
  description: string;
  bedrooms: number;
  goods: string[];
  host: Host;
  images: string[];
  maxAdults: number;
};
