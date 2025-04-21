import React from 'react';
import { Clock, Map, ArrowRight } from 'lucide-react';
import { Flight } from '../types';
import { getAirportByCode } from '../data/airports';

interface FlightCardProps {
  flight: Flight;
  onClick?: () => void;
}

const FlightCard: React.FC<FlightCardProps> = ({ flight, onClick }) => {
  const originAirport = getAirportByCode(flight.origin);
  const destinationAirport = getAirportByCode(flight.destination);

  return (
    <div 
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer border border-gray-200 dark:border-gray-700"
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <img 
              src={flight.logo} 
              alt={flight.airline} 
              className="h-8 w-8 object-contain mr-3" 
            />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{flight.airline}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Flight {flight.airlineCode}{Math.floor(Math.random() * 1000) + 1000}</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">${flight.price}</span>
            <p className="text-sm text-gray-500 dark:text-gray-400">per person</p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="text-center flex-1">
            <p className="text-xl font-semibold text-gray-900 dark:text-white">{flight.departureTime}</p>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{flight.origin}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{originAirport?.city}</p>
          </div>
          
          <div className="flex flex-col items-center px-4">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{flight.duration}</div>
            <div className="relative w-20 md:w-32">
              <div className="border-t-2 border-gray-300 dark:border-gray-600 w-full absolute top-1/2"></div>
              <div className="absolute -right-1 top-1/2 transform -translate-y-1/2">
                <ArrowRight className="h-3 w-3 text-gray-400" />
              </div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {flight.stops === 0 ? (
                <span className="text-green-500 dark:text-green-400">Direct</span>
              ) : (
                <span>{flight.stops} {flight.stops === 1 ? 'stop' : 'stops'}</span>
              )}
            </div>
          </div>
          
          <div className="text-center flex-1">
            <p className="text-xl font-semibold text-gray-900 dark:text-white">{flight.arrivalTime}</p>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{flight.destination}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{destinationAirport?.city}</p>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-gray-500 dark:text-gray-400">
            <Clock className="h-4 w-4 mr-1" />
            <span>{flight.duration}</span>
          </div>

          {flight.stops > 0 && flight.stopLocations && (
            <div className="flex items-center text-gray-500 dark:text-gray-400">
              <Map className="h-4 w-4 mr-1" />
              <span>
                via {flight.stopLocations.join(', ')}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 border-t border-gray-200 dark:border-gray-600">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {flight.departureDate === flight.arrivalDate ? 'Same day arrival' : '+1 day arrival'}
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onClick && onClick();
              
            }}
            className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors flex items-center"
          >
            View details
            <ArrowRight className="h-3 w-3 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlightCard;