export interface Booking {
  id: string;
  name: string;
  passengers: number;
  pickup: string;
  destination: string;
  dateTime: string;
  distance: number;
  duration: string;
  price: number;
  timestamp: string;
}

export interface RouteInfo {
  distance: number; // in meters
  duration: string;
  price: number;
}

export interface AddressAutocomplete {
  address: string;
  placeId: string;
}