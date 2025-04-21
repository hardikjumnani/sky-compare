import React from 'react';
import { Clock, X, Plane } from 'lucide-react';
import { SearchHistory, SearchParams } from '../types';
import { getAirportByCode } from '../data/airports';
import { removeSearchFromHistory, clearSearchHistory } from '../utils/localStorage';

interface SearchHistoryProps {
  history: SearchHistory[];
  onSelectSearch: (searchParams: SearchParams) => void;
  onHistoryUpdate: () => void;
}

const SearchHistoryItem: React.FC<{
  item: SearchHistory;
  onSelect: () => void;
  onRemove: () => void;
}> = ({ item, onSelect, onRemove }) => {
  const originAirport = getAirportByCode(item.searchParams.origin);
  const destinationAirport = getAirportByCode(item.searchParams.destination);
  
  const formattedDate = new Date(item.timestamp).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start mb-2">
        <div onClick={onSelect} className="cursor-pointer flex-1">
          <div className="flex items-center">
            <Plane className="h-4 w-4 mr-2 text-blue-500" />
            <span className="font-medium text-gray-900 dark:text-white">
              {originAirport?.city} to {destinationAirport?.city}
            </span>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {item.searchParams.departureDate}
            {item.searchParams.returnDate ? ` - ${item.searchParams.returnDate}` : ' (One way)'}
          </div>
        </div>
        <button 
          onClick={onRemove}
          className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          <span>Searched: {formattedDate}</span>
        </div>
        <div>
          {item.searchParams.passengers} {item.searchParams.passengers === 1 ? 'passenger' : 'passengers'}
        </div>
      </div>
    </div>
  );
};

const SearchHistoryComponent: React.FC<SearchHistoryProps> = ({ 
  history, 
  onSelectSearch, 
  onHistoryUpdate 
}) => {
  if (history.length === 0) {
    return null;
  }

  const handleRemoveItem = (id: string) => {
    removeSearchFromHistory(id);
    onHistoryUpdate();
  };

  const handleClearAll = () => {
    clearSearchHistory();
    onHistoryUpdate();
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          Recent Searches
        </h2>
        <button 
          onClick={handleClearAll}
          className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {history.map((item) => (
          <SearchHistoryItem
            key={item.id}
            item={item}
            onSelect={() => onSelectSearch(item.searchParams)}
            onRemove={() => handleRemoveItem(item.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default SearchHistoryComponent;