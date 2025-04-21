import React, { useState } from 'react';
import { ArrowDownUp, Filter, Calendar, Plane, ArrowRight } from 'lucide-react';
import { Flight } from '../types';
import FlightCard from './FlightCard';
import FlightDetailModal from './FlightDetailModal';

interface FlightResultsProps {
  flights: Flight[];
  loading?: boolean;
  origin: string;
  destination: string;
  departureDate: string;
}

type SortKey = 'price' | 'duration' | 'departureTime' | 'arrivalTime';

const FlightResults: React.FC<FlightResultsProps> = ({
  flights,
  loading = false,
  origin,
  destination,
  departureDate,
}) => {
  const [sortKey, setSortKey] = useState<SortKey>('price');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [filterStops, setFilterStops] = useState<number[]>([0, 1, 2]);
  const [filterAirlines, setFilterAirlines] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Get unique airlines from flights
  const airlines = [...new Set(flights.map(flight => flight.airline))];

  const toggleAirlineFilter = (airline: string) => {
    setFilterAirlines((prev) => {
      if (prev.includes(airline)) {
        return prev.filter(a => a !== airline);
      } else {
        return [...prev, airline];
      }
    });
  };

  const toggleStopFilter = (stops: number) => {
    setFilterStops((prev) => {
      if (prev.includes(stops)) {
        return prev.filter(s => s !== stops);
      } else {
        return [...prev, stops];
      }
    });
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const getTimeInMinutes = (timeString: string): number => {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const getDurationInMinutes = (duration: string): number => {
    const hourMatch = duration.match(/(\d+)h/);
    const minuteMatch = duration.match(/(\d+)m/);
    
    const hours = hourMatch ? parseInt(hourMatch[1], 10) : 0;
    const minutes = minuteMatch ? parseInt(minuteMatch[1], 10) : 0;
    
    return hours * 60 + minutes;
  };

  const sortedFlights = [...flights]
    .filter(flight => filterStops.includes(flight.stops))
    .filter(flight => filterAirlines.length === 0 || filterAirlines.includes(flight.airline))
    .sort((a, b) => {
      let comparison = 0;
      
      if (sortKey === 'price') {
        comparison = a.price - b.price;
      } else if (sortKey === 'duration') {
        comparison = getDurationInMinutes(a.duration) - getDurationInMinutes(b.duration);
      } else if (sortKey === 'departureTime') {
        comparison = getTimeInMinutes(a.departureTime) - getTimeInMinutes(b.departureTime);
      } else if (sortKey === 'arrivalTime') {
        comparison = getTimeInMinutes(a.arrivalTime) - getTimeInMinutes(b.arrivalTime);
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">Searching for flights...</p>
          <p className="text-gray-500 dark:text-gray-400">Finding the best prices for your trip</p>
        </div>
      </div>
    );
  }

  if (flights.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
        <Plane className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No flights found</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          We couldn't find any flights matching your search criteria.
        </p>
        <p className="text-gray-500 dark:text-gray-400">
          Try adjusting your search parameters or select a different date.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <Plane className="h-5 w-5 mr-2" />
              {origin} <ArrowRight className="h-4 w-4 mx-2" /> {destination}
            </h2>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{departureDate}</span>
              <span className="mx-2">&bull;</span>
              <span>{sortedFlights.length} flights found</span>
            </div>
          </div>
          <div className="flex mt-4 sm:mt-0">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors mr-2"
            >
              <Filter className="h-4 w-4 mr-1.5" />
              Filters
              {(filterStops.length < 3 || filterAirlines.length > 0) && (
                <span className="ml-1.5 bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                  {(filterStops.length < 3 ? 1 : 0) + (filterAirlines.length > 0 ? 1 : 0)}
                </span>
              )}
            </button>
            <div className="relative">
              <button
                onClick={() => handleSort(sortKey)}
                className="flex items-center px-3 py-2 text-sm font-medium rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
              >
                <ArrowDownUp className="h-4 w-4 mr-1.5" />
                Sort: {sortKey.charAt(0).toUpperCase() + sortKey.slice(1)} ({sortDirection === 'asc' ? 'Low to High' : 'High to Low'})
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 hidden group-focus:block transition-all">
                <div className="py-1">
                  <button 
                    onClick={() => handleSort('price')}
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                  >
                    Price
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showFilters && (
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 mt-2 mb-4 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">Stops</h3>
                <div className="space-y-2">
                  {[0, 1, 2].map((stops) => (
                    <label key={stops} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filterStops.includes(stops)}
                        onChange={() => toggleStopFilter(stops)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-gray-700 dark:text-gray-300">
                        {stops === 0 ? 'Direct' : stops === 1 ? '1 Stop' : '2+ Stops'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              
              {airlines.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-3">Airlines</h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {airlines.map((airline) => (
                      <label key={airline} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filterAirlines.includes(airline)}
                          onChange={() => toggleAirlineFilter(airline)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-gray-700 dark:text-gray-300">{airline}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => {
                  setFilterStops([0, 1, 2]);
                  setFilterAirlines([]);
                }}
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Clear filters
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-wrap -mx-2 mt-2">
          <button
            onClick={() => handleSort('price')}
            className={`mx-2 mb-2 px-3 py-1 text-sm rounded-full ${
              sortKey === 'price' 
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100' 
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
            }`}
          >
            Price {sortKey === 'price' && (sortDirection === 'asc' ? '↑' : '↓')}
          </button>
          <button
            onClick={() => handleSort('duration')}
            className={`mx-2 mb-2 px-3 py-1 text-sm rounded-full ${
              sortKey === 'duration' 
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100' 
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
            }`}
          >
            Duration {sortKey === 'duration' && (sortDirection === 'asc' ? '↑' : '↓')}
          </button>
          <button
            onClick={() => handleSort('departureTime')}
            className={`mx-2 mb-2 px-3 py-1 text-sm rounded-full ${
              sortKey === 'departureTime' 
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100' 
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
            }`}
          >
            Departure {sortKey === 'departureTime' && (sortDirection === 'asc' ? '↑' : '↓')}
          </button>
          <button
            onClick={() => handleSort('arrivalTime')}
            className={`mx-2 mb-2 px-3 py-1 text-sm rounded-full ${
              sortKey === 'arrivalTime' 
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100' 
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
            }`}
          >
            Arrival {sortKey === 'arrivalTime' && (sortDirection === 'asc' ? '↑' : '↓')}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {sortedFlights.map((flight) => (
          <FlightCard 
            key={flight.id} 
            flight={flight}
            onClick={() => setSelectedFlight(flight)}
          />
        ))}
      </div>

      {selectedFlight && (
        <FlightDetailModal
          flight={selectedFlight}
          onClose={() => setSelectedFlight(null)}
        />
      )}
    </div>
  );
};

export default FlightResults;