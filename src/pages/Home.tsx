import React, { useState, useEffect } from 'react';
import SearchForm from '../components/SearchForm';
import FlightResults from '../components/FlightResults';
import SearchHistory from '../components/SearchHistory';
import PriceTimelineChart from '../components/PriceTimelineChart';
import ThemeToggle from '../components/ThemeToggle';
import { SearchParams, Flight, SearchHistory as SearchHistoryType } from '../types';
import { getSearchHistory } from '../utils/localStorage';
import { generateMockFlights } from '../data/mockFlightData';
import { Plane } from 'lucide-react';

const Home: React.FC = () => {
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryType[]>([]);

  // Load search history on component mount
  useEffect(() => {
    loadSearchHistory();
  }, []);

  const loadSearchHistory = () => {
    setSearchHistory(getSearchHistory());
  };

  const handleSearch = (params: SearchParams) => {
    setSearchParams(params);
    setLoading(true);
    
    // Simulate API call with a timeout
    setTimeout(() => {
      const mockFlights = generateMockFlights(
        params.origin,
        params.destination,
        params.departureDate,
        15 // Number of flights to generate
      );
      setFlights(mockFlights);
      setLoading(false);
    }, 1500);
    
    // Refresh search history
    loadSearchHistory();
  };

  const handleDateSelect = (date: string) => {
    if (searchParams) {
      const updatedParams = { ...searchParams, departureDate: date };
      handleSearch(updatedParams);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <header className="bg-white dark:bg-gray-800 shadow-sm transition-colors">
        <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Plane className="h-8 w-8 text-blue-500 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">SkyCompare</h1>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <SearchForm onSearch={handleSearch} loading={loading} />
        
        <SearchHistory 
          history={searchHistory} 
          onSelectSearch={handleSearch}
          onHistoryUpdate={loadSearchHistory}
        />
        
        {searchParams && !loading && flights.length > 0 && (
          <PriceTimelineChart 
            departureDate={searchParams.departureDate}
            origin={searchParams.origin}
            destination={searchParams.destination}
            onSelectDate={handleDateSelect}
          />
        )}
        
        {(loading || flights.length > 0) && searchParams && (
          <FlightResults 
            flights={flights}
            loading={loading}
            origin={searchParams.origin}
            destination={searchParams.destination}
            departureDate={searchParams.departureDate}
          />
        )}
      </main>
      
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6 transition-colors">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500 dark:text-gray-400 text-sm">
            <p>&copy; {new Date().getFullYear()} SkyCompare. All flights and prices are simulated for demonstration purposes.</p>
            <p className="mt-1">Built with React + Vite + TailwindCSS</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;