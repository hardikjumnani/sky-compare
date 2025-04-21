# SkyCompare - Flight Ticket Price Comparer

SkyCompare is a modern web application that helps users find and compare flight prices across multiple airlines. Built with React, TypeScript, and Tailwind CSS, it provides a seamless experience for searching both domestic and international flights.

![SkyCompare Screenshot](https://images.pexels.com/photos/62623/wing-plane-flying-airplane-62623.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)

## Features

- **Advanced Flight Search**: Search for flights with flexible date options and multiple passengers
- **Real-time Price Comparison**: Compare prices across different airlines instantly
- **Interactive Timeline**: View price trends across different dates
- **Detailed Flight Information**: Get comprehensive details about each flight, including:
  - Duration
  - Stopovers
  - Airline information
  - Price breakdown
- **Search History**: Keep track of your recent searches
- **Dark Mode Support**: Toggle between light and dark themes
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## Coverage

### Airlines
- **Indian Carriers**: IndiGo, Air India, SpiceJet, Vistara, Go First, Air Asia India
- **International Airlines**: Emirates, Qatar Airways, Singapore Airlines, British Airways, Lufthansa, Turkish Airlines

### Airports
- **Major Indian Cities**: Delhi, Mumbai, Bangalore, Hyderabad, Chennai, Kolkata, and more
- **International Hubs**: New York (JFK), London (LHR), Dubai (DXB), Singapore (SIN), and others

## Technical Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Hooks
- **Data Persistence**: LocalStorage

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/skycompare.git
```

2. Install dependencies:
```bash
cd skycompare
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/         # Reusable UI components
├── data/              # Mock data and utilities
├── pages/             # Page components
├── types/             # TypeScript type definitions
├── utils/             # Helper functions
└── App.tsx            # Root component
```

## Key Components

- `SearchForm`: Main flight search interface
- `FlightResults`: Displays search results with sorting and filtering
- `FlightCard`: Individual flight result card
- `FlightDetailModal`: Detailed flight information
- `PriceTimelineChart`: Visual price comparison across dates
- `SearchHistory`: Recent search management

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Flight data is simulated for demonstration purposes
- Airline logos are sourced from Wikimedia Commons
- Icons provided by Lucide React