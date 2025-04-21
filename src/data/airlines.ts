export interface Airline {
  code: string;
  name: string;
  logo: string;
}

export const airlines: Airline[] = [
  // Indian Airlines
  {
    code: '6E',
    name: 'IndiGo',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/IndiGo_Airlines_logo.svg/400px-IndiGo_Airlines_logo.svg.png'
  },
  {
    code: 'AI',
    name: 'Air India',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Air_India_Logo.svg/400px-Air_India_Logo.svg.png'
  },
  {
    code: 'SG',
    name: 'SpiceJet',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/SpiceJet_Logo.svg/400px-SpiceJet_Logo.svg.png'
  },
  {
    code: 'UK',
    name: 'Vistara',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Vistara_Logo.svg/400px-Vistara_Logo.svg.png'
  },
  {
    code: 'G8',
    name: 'Go First',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Go_First_Logo.svg/400px-Go_First_Logo.svg.png'
  },
  {
    code: 'I5',
    name: 'Air Asia India',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/AirAsia_New_Logo.svg/400px-AirAsia_New_Logo.svg.png'
  },
  // International Airlines
  {
    code: 'EK',
    name: 'Emirates',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Emirates_logo.svg/400px-Emirates_logo.svg.png'
  },
  {
    code: 'QR',
    name: 'Qatar Airways',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Qatar_Airways_Logo.svg/400px-Qatar_Airways_Logo.svg.png'
  },
  {
    code: 'SQ',
    name: 'Singapore Airlines',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/6/6b/Singapore_Airlines_Logo_2.svg/400px-Singapore_Airlines_Logo_2.svg.png'
  },
  {
    code: 'BA',
    name: 'British Airways',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/British_Airways_Speedmarque.svg/400px-British_Airways_Speedmarque.svg.png'
  },
  {
    code: 'LH',
    name: 'Lufthansa',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Lufthansa_Logo_2018.svg/400px-Lufthansa_Logo_2018.svg.png'
  },
  {
    code: 'TK',
    name: 'Turkish Airlines',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Turkish_Airlines_logo_2019.svg/400px-Turkish_Airlines_logo_2019.svg.png'
  }
];

export const getAirlineByCode = (code: string): Airline | undefined => {
  return airlines.find(airline => airline.code === code);
};