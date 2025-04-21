import React, { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';

interface PricePoint {
  date: string;
  price: number;
  isSelected: boolean;
}

interface PriceTimelineChartProps {
  departureDate: string;
  origin: string;
  destination: string;
  onSelectDate: (date: string) => void;
}

const PriceTimelineChart: React.FC<PriceTimelineChartProps> = ({
  departureDate,
  origin,
  destination,
  onSelectDate
}) => {
  const [priceData, setPriceData] = useState<PricePoint[]>([]);
  
  // Generate mock price data for the timeline
  useEffect(() => {
    if (!departureDate || !origin || !destination) return;
    
    const date = new Date(departureDate);
    const pricePoints: PricePoint[] = [];
    
    // Generate 7 days before and 7 days after the selected date
    for (let i = -7; i <= 7; i++) {
      const currentDate = new Date(date);
      currentDate.setDate(date.getDate() + i);
      
      // Skip dates in the past
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (currentDate < today) continue;
      
      const formattedDate = currentDate.toISOString().split('T')[0];
      const isSelected = formattedDate === departureDate;
      
      // Generate a random price between $200 and $500
      // Make the selected date have a slightly lower price to show as a "good deal"
      let price = Math.floor(Math.random() * 300) + 200;
      if (isSelected) {
        price = Math.floor(price * 0.9);
      }
      
      pricePoints.push({
        date: formattedDate,
        price,
        isSelected
      });
    }
    
    setPriceData(pricePoints);
  }, [departureDate, origin, destination]);
  
  // Find the minimum and maximum prices for scaling
  const minPrice = Math.min(...priceData.map(p => p.price));
  const maxPrice = Math.max(...priceData.map(p => p.price));
  const priceRange = maxPrice - minPrice;
  
  // Format a date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (priceData.length === 0) return null;
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Price Timeline
        </h2>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {priceData.length} days shown
        </div>
      </div>
      
      <div className="relative h-56">
        <div className="flex items-end justify-between h-40 mb-4">
          {priceData.map((point, index) => {
            // Calculate height based on price (higher price = shorter bar)
            const heightPercentage = priceRange === 0 
              ? 100 
              : 100 - ((point.price - minPrice) / priceRange * 80);
            
            return (
              <div 
                key={index} 
                className="flex flex-col items-center flex-1"
                onClick={() => onSelectDate(point.date)}
              >
                <div 
                  className={`
                    relative w-full mx-1 cursor-pointer group
                    ${point.isSelected ? 'animate-pulse duration-1000' : ''}
                  `}
                >
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-xs font-medium invisible group-hover:visible bg-gray-800 dark:bg-gray-700 text-white px-2 py-1 rounded mb-1 whitespace-nowrap">
                    ${point.price}
                  </div>
                  <div 
                    style={{ height: `${heightPercentage}%` }}
                    className={`
                      w-full rounded-t-sm transition-all duration-200
                      ${point.isSelected 
                        ? 'bg-blue-500 dark:bg-blue-600' 
                        : point.price === minPrice 
                          ? 'bg-green-500 dark:bg-green-600' 
                          : point.price >= maxPrice * 0.9 
                            ? 'bg-red-400 dark:bg-red-600'
                            : 'bg-blue-300 dark:bg-blue-700'
                      }
                      group-hover:opacity-80
                    `}
                  ></div>
                </div>
                <div className={`
                  text-xs mt-1 font-medium whitespace-nowrap
                  ${point.isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}
                `}>
                  {formatDate(point.date)}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Price legend */}
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 px-2">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 dark:bg-green-600 rounded-sm mr-1"></div>
            <span>Best Price</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 dark:bg-blue-600 rounded-sm mr-1"></div>
            <span>Selected Date</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-400 dark:bg-red-600 rounded-sm mr-1"></div>
            <span>Highest Price</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceTimelineChart;