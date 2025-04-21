export interface Flight {
  id: string;
  airline: string;
  airlineCode: string;
  logo: string;
  origin: string;
  destination: string;
  departureDate: string;
  departureTime: string;
  arrivalDate: string;
  arrivalTime: string;
  duration: string;
  price: number;
  currency: string;
  stops: number;
  stopLocations?: string[];
}

export interface SearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
  tripType: 'oneWay' | 'roundTrip';
}

export interface SearchHistory {
  id: string;
  searchParams: SearchParams;
  timestamp: number;
}