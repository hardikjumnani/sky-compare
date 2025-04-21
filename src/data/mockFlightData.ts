import { Flight } from '../types';
import { airlines } from './airlines';

// Helper function to generate a random price within a range
const generateRandomPrice = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

// Helper function to get a random airline
const getRandomAirline = (origin: string, destination: string): typeof airlines[0] => {
  // If both airports are in India, only use Indian airlines
  const isIndianDomestic = origin.match(/^(DEL|BOM|BLR|HYD|MAA|CCU|COK|PNQ|AMD|GOI|JAI|IXC|LKO|PAT|IXR)$/) &&
                          destination.match(/^(DEL|BOM|BLR|HYD|MAA|CCU|COK|PNQ|AMD|GOI|JAI|IXC|LKO|PAT|IXR)$/);

  const indianAirlines = airlines.filter(airline => 
    ['6E', 'AI', 'SG', 'UK', 'G8', 'I5'].includes(airline.code)
  );

  const internationalAirlines = airlines.filter(airline => 
    !['6E', 'AI', 'SG', 'UK', 'G8', 'I5'].includes(airline.code)
  );

  const availableAirlines = isIndianDomestic ? indianAirlines : airlines;
  const randomIndex = Math.floor(Math.random() * availableAirlines.length);
  return availableAirlines[randomIndex];
};

// Helper to generate a random duration based on route type
const generateRandomDuration = (origin: string, destination: string): string => {
  const isIndianDomestic = origin.match(/^(DEL|BOM|BLR|HYD|MAA|CCU|COK|PNQ|AMD|GOI|JAI|IXC|LKO|PAT|IXR)$/) &&
                          destination.match(/^(DEL|BOM|BLR|HYD|MAA|CCU|COK|PNQ|AMD|GOI|JAI|IXC|LKO|PAT|IXR)$/);
  
  let minHours, maxHours;
  
  if (isIndianDomestic) {
    minHours = 1;
    maxHours = 4;
  } else {
    minHours = 4;
    maxHours = 15;
  }
  
  const hours = Math.floor(Math.random() * (maxHours - minHours + 1)) + minHours;
  const minutes = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
  return `${hours}h ${minutes}m`;
};

// Helper to generate random stop locations based on route
const generateStopLocations = (count: number, origin: string, destination: string): string[] => {
  const isIndianDomestic = origin.match(/^(DEL|BOM|BLR|HYD|MAA|CCU|COK|PNQ|AMD|GOI|JAI|IXC|LKO|PAT|IXR)$/) &&
                          destination.match(/^(DEL|BOM|BLR|HYD|MAA|CCU|COK|PNQ|AMD|GOI|JAI|IXC|LKO|PAT|IXR)$/);

  const domesticStops = ['DEL', 'BOM', 'BLR', 'HYD', 'MAA', 'CCU'];
  const internationalStops = ['DXB', 'DOH', 'SIN', 'BKK', 'AUH', 'MCT'];
  
  const possibleStops = isIndianDomestic ? domesticStops : internationalStops;
  const stops: string[] = [];
  
  for (let i = 0; i < count; i++) {
    const availableStops = possibleStops.filter(stop => 
      !stops.includes(stop) && stop !== origin && stop !== destination
    );
    const randomIndex = Math.floor(Math.random() * availableStops.length);
    stops.push(availableStops[randomIndex]);
  }
  
  return stops;
};

// Function to generate mock flight data based on search parameters
export const generateMockFlights = (
  origin: string,
  destination: string,
  departureDate: string,
  numFlights: number = 15
): Flight[] => {
  const flights: Flight[] = [];
  const isIndianDomestic = origin.match(/^(DEL|BOM|BLR|HYD|MAA|CCU|COK|PNQ|AMD|GOI|JAI|IXC|LKO|PAT|IXR)$/) &&
                          destination.match(/^(DEL|BOM|BLR|HYD|MAA|CCU|COK|PNQ|AMD|GOI|JAI|IXC|LKO|PAT|IXR)$/);

  for (let i = 0; i < numFlights; i++) {
    const airline = getRandomAirline(origin, destination);
    const stops = Math.floor(Math.random() * (isIndianDomestic ? 2 : 3)); // 0-1 stops for domestic, 0-2 for international
    const stopLocations = stops ? generateStopLocations(stops, origin, destination) : undefined;
    const duration = generateRandomDuration(origin, destination);

    // Generate departure time
    const departureHour = Math.floor(Math.random() * 24).toString().padStart(2, '0');
    const departureMinute = [0, 15, 30, 45][Math.floor(Math.random() * 4)].toString().padStart(2, '0');
    const departureTime = `${departureHour}:${departureMinute}`;

    // Calculate arrival time based on duration
    const durationHours = parseInt(duration.split('h')[0]);
    const durationMinutes = parseInt(duration.split('h ')[1].split('m')[0]);
    
    let arrivalHour = parseInt(departureHour) + durationHours;
    let arrivalMinute = parseInt(departureMinute) + durationMinutes;
    
    if (arrivalMinute >= 60) {
      arrivalHour += 1;
      arrivalMinute -= 60;
    }
    
    let arrivalDate = departureDate;
    if (arrivalHour >= 24) {
      arrivalHour -= 24;
      const date = new Date(departureDate);
      date.setDate(date.getDate() + 1);
      arrivalDate = date.toISOString().split('T')[0];
    }
    
    const arrivalTime = `${arrivalHour.toString().padStart(2, '0')}:${arrivalMinute.toString().padStart(2, '0')}`;

    // Generate price based on route type and stops
    const basePrice = isIndianDomestic 
      ? generateRandomPrice(2000, 8000) // Prices in INR for domestic
      : generateRandomPrice(30000, 120000); // Prices in INR for international
    
    const priceModifier = stops === 0 ? 1.3 : stops === 1 ? 1 : 0.8;
    const finalPrice = Math.round(basePrice * priceModifier);

    flights.push({
      id: crypto.randomUUID(),
      airline: airline.name,
      airlineCode: airline.code,
      logo: airline.logo,
      origin,
      destination,
      departureDate,
      departureTime,
      arrivalDate,
      arrivalTime,
      duration,
      price: finalPrice,
      currency: 'INR',
      stops,
      stopLocations
    });
  }

  // Sort flights by price (lowest first) as the default order
  return flights.sort((a, b) => a.price - b.price);
};