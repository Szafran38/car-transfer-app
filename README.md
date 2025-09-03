# Car Transfer Booking App

A responsive single-page web application for booking car transfers with real-time route calculation and pricing using OpenStreetMap and Leaflet.

## Features

- **Interactive Booking Form**: Name, passengers, pickup/destination with address autocomplete, date/time selection
- **Real-time Route Calculation**: OpenStreetMap integration with driving directions and distance calculation
- **Dynamic Pricing**: €0.30 per kilometer with automatic price calculation
- **Visual Route Display**: Interactive Leaflet map showing the complete route with polyline
- **Booking Confirmation**: Local storage persistence with confirmation numbers
- **Responsive Design**: Mobile-first design that works seamlessly on all devices
- **Form Validation**: Comprehensive validation with clear error messaging
- **Free APIs**: Uses OpenStreetMap, Nominatim, and OSRM - no API keys required

## Tech Stack

- **Frontend**: Next.js 13+ with React 18 and TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Maps**: Leaflet with react-leaflet
- **Geocoding**: Nominatim (OpenStreetMap)
- **Routing**: OSRM (Open Source Routing Machine)
- **Storage**: Browser localStorage for booking persistence
- **Icons**: Lucide React

## Setup Instructions

### 1. Installation and Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Building for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## Usage

1. **Enter Trip Details**: Fill in your name, number of passengers, pickup and destination addresses (with autocomplete), and travel date/time
2. **Calculate Price**: Click "Calculate Price" to see the route on the map and get the total cost
3. **Review Summary**: Check the distance, duration, and price in the summary card
4. **Confirm Booking**: Click "Book Now" to save your booking and receive a confirmation number
5. **Manage Bookings**: Bookings are stored locally in your browser for future reference

## Pricing

- **Rate**: €0.30 per kilometer
- **Calculation**: Based on the actual driving distance provided by OSRM
- **Minimum**: No minimum fare (simple distance-based pricing)

## APIs Used (All Free)

- **OpenStreetMap**: Map tiles and geographic data
- **Nominatim**: Address geocoding and search autocomplete
- **OSRM**: Route calculation and driving directions

No API keys or registration required - all services are free and open source.

## Browser Compatibility

- Modern browsers with ES6+ support
- Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

## Local Storage

Confirmed bookings are stored in your browser's localStorage under the key `car_transfer_bookings`. This data persists between sessions but is specific to your browser and device.

## Features

### Address Autocomplete
- Type at least 3 characters to see address suggestions
- Powered by Nominatim geocoding service
- Supports worldwide addresses

### Interactive Map
- Leaflet-based map with OpenStreetMap tiles
- Custom markers for pickup (green) and destination (red)
- Route visualization with blue polyline
- Automatic map bounds adjustment to show full route

### Responsive Design
- Mobile-first approach
- Form and map stack vertically on mobile
- Side-by-side layout on desktop
- Touch-friendly interface elements

### Validation
- Real-time form validation
- Clear error messages
- Prevents duplicate pickup/destination
- Date/time validation (future dates only)

## Development Notes

The app uses free, open-source mapping services which provide excellent coverage and reliability without requiring API keys or billing setup. This makes it perfect for development, testing, and production use without ongoing costs.