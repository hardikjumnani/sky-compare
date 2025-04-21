import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Calendar, Users, RefreshCw, ArrowLeft, ArrowRight, Plane } from 'lucide-react';
import { airports, searchAirports } from '../data/airports';
import { SearchParams } from '../types';
import { saveSearchToHistory } from '../utils/localStorage';

interface SearchFormProps {
  onSearch: (searchParams: SearchParams) => void;
  loading?: boolean;
}

interface AirportInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

const AirportInput: React.FC<AirportInputProps> = ({ id, label, value, onChange, placeholder }) => {
  const [suggestions, setSuggestions] = useState<typeof airports>([]);
  const [isFocused, setIsFocused] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    onChange(query);
    
    if (query.length > 1) {
      setSuggestions(searchAirports(query).slice(0, 5));
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectAirport = (code: string, name: string, city: string, country: string) => {
    onChange(`${code} - ${city}, ${country}`);
    setSuggestions([]);
    setIsFocused(false);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <label 
        htmlFor={id} 
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <MapPin className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          id={id}
          value={value}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-colors"
        />
      </div>
      {isFocused && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-y-auto dark:bg-gray-800 border dark:border-gray-700">
          <ul className="py-1">
            {suggestions.map((airport) => (
              <li
                key={airport.code}
                onClick={() => handleSelectAirport(airport.code, airport.name, airport.city, airport.country)}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="font-medium">{airport.code} - {airport.city}, {airport.country}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{airport.name}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, loading = false }) => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [tripType, setTripType] = useState<'oneWay' | 'roundTrip'>('roundTrip');
  const [error, setError] = useState('');

  // Set default dates on component mount
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDepartureDate(tomorrow.toISOString().split('T')[0]);

    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 8);
    setReturnDate(nextWeek.toISOString().split('T')[0]);
  }, []);

  const swapLocations = () => {
    setOrigin(destination);
    setDestination(origin);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!origin || !destination) {
      setError('Please specify both origin and destination airports');
      return;
    }

    if (origin === destination) {
      setError('Origin and destination cannot be the same');
      return;
    }

    if (!departureDate) {
      setError('Please select a departure date');
      return;
    }

    if (tripType === 'roundTrip' && !returnDate) {
      setError('Please select a return date');
      return;
    }

    // Extract airport codes from formatted strings
    const originCode = origin.split(' - ')[0];
    const destinationCode = destination.split(' - ')[0];

    const searchParams: SearchParams = {
      origin: originCode,
      destination: destinationCode,
      departureDate,
      passengers,
      tripType
    };

    if (tripType === 'roundTrip') {
      searchParams.returnDate = returnDate;
    }

    // Save search to history
    saveSearchToHistory(searchParams);

    // Trigger search
    onSearch(searchParams);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 mb-8 transition-colors">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <Plane className="h-5 w-5 mr-2" />
            Find Your Flight
          </h2>
          <div className="ml-auto flex items-center space-x-4">
            <div className="flex items-center">
              <input
                type="radio"
                id="roundTrip"
                checked={tripType === 'roundTrip'}
                onChange={() => setTripType('roundTrip')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="roundTrip" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Round Trip
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="oneWay"
                checked={tripType === 'oneWay'}
                onChange={() => setTripType('oneWay')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="oneWay" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                One Way
              </label>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="col-span-1 relative">
            <AirportInput
              id="origin"
              label="From"
              value={origin}
              onChange={setOrigin}
              placeholder="Airport or city"
            />
          </div>
          
          <div className="col-span-1 relative">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 md:block hidden">
              <button 
                type="button" 
                onClick={swapLocations}
                className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <RefreshCw className="h-4 w-4 text-blue-500" />
              </button>
            </div>
            <AirportInput
              id="destination"
              label="To"
              value={destination}
              onChange={setDestination}
              placeholder="Airport or city"
            />
          </div>

          <div className="col-span-1">
            <label htmlFor="departureDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Departure Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                id="departureDate"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-colors"
              />
            </div>
          </div>

          {tripType === 'roundTrip' && (
            <div className="col-span-1">
              <label htmlFor="returnDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Return Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  id="returnDate"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  min={departureDate || new Date().toISOString().split('T')[0]}
                  className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-colors"
                />
              </div>
            </div>
          )}

          <div className={`col-span-1 ${tripType === 'oneWay' ? 'md:col-span-2' : ''}`}>
            <label htmlFor="passengers" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Passengers
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Users className="h-5 w-5 text-gray-400" />
              </div>
              <select
                id="passengers"
                value={passengers}
                onChange={(e) => setPassengers(parseInt(e.target.value))}
                className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-colors"
              >
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Passenger' : 'Passengers'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="col-span-1 md:col-span-1 lg:col-span-2 flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Searching...
                </>
              ) : (
                <>
                  <span>Search Flights</span>
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchForm;