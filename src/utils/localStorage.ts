import { SearchHistory, SearchParams } from '../types';

const SEARCH_HISTORY_KEY = 'flightSearchHistory';

export const saveSearchToHistory = (searchParams: SearchParams): void => {
  const history = getSearchHistory();
  
  const newSearch: SearchHistory = {
    id: crypto.randomUUID(),
    searchParams,
    timestamp: Date.now()
    
  };
  
  // Add to beginning of array (most recent first)
  history.unshift(newSearch);
  
  // Limit history to 10 items
  const limitedHistory = history.slice(0, 10);
  
  localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(limitedHistory));
};

export const getSearchHistory = (): SearchHistory[] => {
  const history = localStorage.getItem(SEARCH_HISTORY_KEY);
  return history ? JSON.parse(history) : [];
};

export const clearSearchHistory = (): void => {
  localStorage.removeItem(SEARCH_HISTORY_KEY);
};

export const removeSearchFromHistory = (id: string): void => {
  const history = getSearchHistory();
  const updatedHistory = history.filter(item => item.id !== id);
  localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updatedHistory));
};