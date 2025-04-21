import React from 'react';
import { X, Clock, MapPin, Briefcase, Coffee, Wifi, Plug, ArrowRight } from 'lucide-react';
import { Flight } from '../types';
import { getAirportByCode } from '../data/airports';

interface FlightDetailModalProps {
  flight: Flight;
  onClose: () => void;
}

const FlightDetailModal: React.FC<FlightDetailModalProps> = ({ flight, onClose }) => {
  const originAirport = getAirportByCode(flight.origin);
  const destinationAirport = getAirportByCode(flight.destination);

  // Generate random amenities for the flight
  const amenities = [
    { icon: <Wifi className="h-4 w-4 mr-2" />, name: 'Wi-Fi', available: Math.random() > 0.3 },
    { icon: <Plug className="h-4 w-4 mr-2" />, name: 'Power Outlets', available: Math.random() > 0.2 },
    { icon: <Coffee className="h-4 w-4 mr-2" />, name: 'Complimentary Drinks', available: Math.random() > 0.4 },
    { icon: <Briefcase className="h-4 w-4 mr-2" />, name: 'Extra Legroom', available: Math.random() > 0.6 },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="flex items-center mb-6">
            <img 
              src={flight.logo} 
              alt={flight.airline} 
              className="h-12 w-12 object-contain mr-4" 
            />
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{flight.airline}</h2>
              <p className="text-gray-600 dark:text-gray-300">Flight {flight.airlineCode}{Math.floor(Math.random() * 1000) + 1000}</p>
            </div>
            <div className="ml-auto text-right">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">${flight.price}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">per person</div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between mb-8">
            <div className="flex-1 md:border-r md:border-gray-200 md:dark:border-gray-700 md:pr-6 mb-4 md:mb-0">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Flight Details</h3>
              
              <div className="flex items-start mb-6">
                <div className="mr-4 pt-1">
                  <div className="h-4 w-4 rounded-full bg-blue-500"></div>
                  <div className="h-16 w-0.5 bg-gray-300 dark:bg-gray-600 mx-auto my-1"></div>
                  <div className="h-4 w-4 rounded-full bg-blue-500"></div>
                </div>
                
                <div className="flex-1">
                  <div className="mb-4">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-xl font-semibold text-gray-900 dark:text-white">{flight.departureTime}</p>
                        <p className="text-gray-700 dark:text-gray-300">{flight.departureDate}</p>
                      </div>
                      <div className="text-right text-sm text-gray-500 dark:text-gray-400">Departure</div>
                    </div>
                    <div className="mt-1">
                      <p className="font-medium text-gray-800 dark:text-gray-200">{originAirport?.name}</p>
                      <p className="text-gray-600 dark:text-gray-400">{originAirport?.city}, {originAirport?.country}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center my-2 text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>Flight duration: {flight.duration}</span>
                  </div>
                  
                  <div>
                    <div className="flex justify-between">
                      <div>
                        <p className="text-xl font-semibold text-gray-900 dark:text-white">{flight.arrivalTime}</p>
                        <p className="text-gray-700 dark:text-gray-300">{flight.arrivalDate}</p>
                      </div>
                      <div className="text-right text-sm text-gray-500 dark:text-gray-400">Arrival</div>
                    </div>
                    <div className="mt-1">
                      <p className="font-medium text-gray-800 dark:text-gray-200">{destinationAirport?.name}</p>
                      <p className="text-gray-600 dark:text-gray-400">{destinationAirport?.city}, {destinationAirport?.country}</p>
                    </div>
                  </div>
                </div>
              </div>

              {flight.stops > 0 && flight.stopLocations && (
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Stops</h4>
                  <ul className="space-y-3">
                    {flight.stopLocations.map((stop, index) => {
                      const stopAirport = getAirportByCode(stop);
                      return (
                        <li key={index} className="flex items-start">
                          <MapPin className="h-5 w-5 text-orange-500 mr-2 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-gray-800 dark:text-gray-200">{stop} - {stopAirport?.city}, {stopAirport?.country}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {stopAirport?.name}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Layover: {Math.floor(Math.random() * 3) + 1}h {[0, 15, 30, 45][Math.floor(Math.random() * 4)]}m
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex-1 md:pl-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Price Breakdown</h3>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Base fare</span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">${Math.round(flight.price * 0.8)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Taxes & fees</span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">${Math.round(flight.price * 0.2)}</span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-600 my-2 pt-2 flex justify-between">
                    <span className="font-semibold text-gray-900 dark:text-white">Total per person</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">${flight.price}</span>
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Flight Amenities</h3>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center">
                    {amenity.icon}
                    <span className={`${amenity.available ? 'text-gray-800 dark:text-gray-200' : 'text-gray-400 dark:text-gray-500 line-through'}`}>
                      {amenity.name}
                    </span>
                    {amenity.available && <span className="ml-1 text-green-500">✓</span>}
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center">
                  Book this flight
                  <ArrowRight className="h-4 w-4 ml-2" />
                </button>
                <p className="text-sm text-center text-gray-500 dark:text-gray-400 mt-2">
                  You'll be redirected to the airline's website
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightDetailModal;