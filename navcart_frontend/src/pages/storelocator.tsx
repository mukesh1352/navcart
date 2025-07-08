import { useEffect, useState } from 'react';

type Location = {
  city: string;
  country: string;
  lat: number;
  lng: number;
};

const StoreLocator = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        // Simulate API call with mock data since we can't make external requests
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate loading
        
        const mockLocations: Location[] = [
          // North America
          // {"city": "New York", "country": "USA", "lat": 40.7128, "lng": -74.0060},
          // {"city": "Los Angeles", "country": "USA", "lat": 34.0522, "lng": -118.2437},
          // {"city": "Toronto", "country": "Canada", "lat": 43.65107, "lng": -79.347015},
          // {"city": "Mexico City", "country": "Mexico", "lat": 19.4326, "lng": -99.1332},
          
          // South America
          // {"city": "São Paulo", "country": "Brazil", "lat": -23.5505, "lng": -46.6333},
          // {"city": "Buenos Aires", "country": "Argentina", "lat": -34.6118, "lng": -58.3960},
          // {"city": "Lima", "country": "Peru", "lat": -12.0464, "lng": -77.0428},
          // {"city": "Bogotá", "country": "Colombia", "lat": 4.7110, "lng": -74.0721},
          
          // // Europe
          // {"city": "London", "country": "UK", "lat": 51.5074, "lng": -0.1278},
          // {"city": "Paris", "country": "France", "lat": 48.8566, "lng": 2.3522},
          // {"city": "Berlin", "country": "Germany", "lat": 52.5200, "lng": 13.4050},
          // {"city": "Rome", "country": "Italy", "lat": 41.9028, "lng": 12.4964},
          // {"city": "Madrid", "country": "Spain", "lat": 40.4168, "lng": -3.7038},
          // {"city": "Amsterdam", "country": "Netherlands", "lat": 52.3676, "lng": 4.9041},
          // {"city": "Stockholm", "country": "Sweden", "lat": 59.3293, "lng": 18.0686},
          // {"city": "Moscow", "country": "Russia", "lat": 55.7558, "lng": 37.6176},
          
          // Asia
          {"city": "Tokyo", "country": "Japan", "lat": 35.6895, "lng": 139.6917},
          {"city": "Beijing", "country": "China", "lat": 39.9042, "lng": 116.4074},
          {"city": "Shanghai", "country": "China", "lat": 31.2304, "lng": 121.4737},
          {"city": "Mumbai", "country": "India", "lat": 19.0760, "lng": 72.8777},
          {"city": "Delhi", "country": "India", "lat": 28.7041, "lng": 77.1025},
          {"city": "Bangalore", "country": "India", "lat": 12.9716, "lng": 77.5946},
          {"city": "Seoul", "country": "South Korea", "lat": 37.5665, "lng": 126.9780},
          {"city": "Singapore", "country": "Singapore", "lat": 1.3521, "lng": 103.8198},
          {"city": "Bangkok", "country": "Thailand", "lat": 13.7563, "lng": 100.5018},
          {"city": "Jakarta", "country": "Indonesia", "lat": -6.2088, "lng": 106.8456},
          {"city": "Kuala Lumpur", "country": "Malaysia", "lat": 3.1390, "lng": 101.6869},
          {"city": "Manila", "country": "Philippines", "lat": 14.5995, "lng": 120.9842},
          {"city": "Ho Chi Minh City", "country": "Vietnam", "lat": 10.8231, "lng": 106.6297},
           {"city":"Coimbatore","country":"India","lat":11.0168,"lng":76.9558},
          
          // Middle East
          // {"city": "Dubai", "country": "UAE", "lat": 25.2048, "lng": 55.2708},
          // {"city": "Doha", "country": "Qatar", "lat": 25.2854, "lng": 51.5310},
          // {"city": "Riyadh", "country": "Saudi Arabia", "lat": 24.7136, "lng": 46.6753},
          // {"city": "Tel Aviv", "country": "Israel", "lat": 32.0853, "lng": 34.7818},
          // {"city": "Istanbul", "country": "Turkey", "lat": 41.0082, "lng": 28.9784},
          
          // // Africa
          // {"city": "Cairo", "country": "Egypt", "lat": 30.0444, "lng": 31.2357},
          // {"city": "Lagos", "country": "Nigeria", "lat": 6.5244, "lng": 3.3792},
          // {"city": "Johannesburg", "country": "South Africa", "lat": -26.2041, "lng": 28.0473},
          // {"city": "Cape Town", "country": "South Africa", "lat": -33.9249, "lng": 18.4241},
          // {"city": "Nairobi", "country": "Kenya", "lat": -1.2921, "lng": 36.8219},
          // {"city": "Casablanca", "country": "Morocco", "lat": 33.5731, "lng": -7.5898},
          // {"city": "Addis Ababa", "country": "Ethiopia", "lat": 9.1450, "lng": 38.7451},
          
          // Oceania
          // {"city": "Sydney", "country": "Australia", "lat": -33.8688, "lng": 151.2093},
          // {"city": "Melbourne", "country": "Australia", "lat": -37.8136, "lng": 144.9631},
          // {"city": "Auckland", "country": "New Zealand", "lat": -36.8485, "lng": 174.7633},
          // {"city": "Perth", "country": "Australia", "lat": -31.9505, "lng": 115.8605},
          // {"city":"Delhi","country":"India","lat":28.6139,"lng":77.2090},
          // {"city":"Kolkata","country":"India","lat":22.5726,"lng":88.3639},
          // {"city":"Mumbai","country":"India","lat":19.0760,"lng":72.8777},
          // {"city":"Chennai","country":"India","lat":13.0827,"lng":80.2707},
          // {"city":"Coimbatore","country":"India","lat":11.0168,"lng":76.9558},
          
          // Additional major cities
          // {"city": "Hong Kong", "country": "Hong Kong", "lat": 22.3193, "lng": 114.1694},
          // {"city": "Taipei", "country": "Taiwan", "lat": 25.0330, "lng": 121.5654},
          // {"city": "Zurich", "country": "Switzerland", "lat": 47.3769, "lng": 8.5417},
          // {"city": "Vienna", "country": "Austria", "lat": 48.2082, "lng": 16.3738},
          // {"city": "Oslo", "country": "Norway", "lat": 59.9139, "lng": 10.7522},
          // {"city": "Helsinki", "country": "Finland", "lat": 60.1699, "lng": 24.9384},
          // {"city": "Copenhagen", "country": "Denmark", "lat": 55.6761, "lng": 12.5683},
          // {"city": "Brussels", "country": "Belgium", "lat": 50.8503, "lng": 4.3517},
          // {"city": "Prague", "country": "Czech Republic", "lat": 50.0755, "lng": 14.4378},
          // {"city": "Warsaw", "country": "Poland", "lat": 52.2297, "lng": 21.0122},
          // {"city": "Budapest", "country": "Hungary", "lat": 47.4979, "lng": 19.0402},
          // {"city": "Athens", "country": "Greece", "lat": 37.9838, "lng": 23.7275},
          // {"city": "Lisbon", "country": "Portugal", "lat": 38.7223, "lng": -9.1393},
          // {"city": "Dublin", "country": "Ireland", "lat": 53.3498, "lng": -6.2603},
          // {"city": "Edinburgh", "country": "Scotland", "lat": 55.9533, "lng": -3.1883},
          // {"city": "Montreal", "country": "Canada", "lat": 45.5017, "lng": -73.5673},
          // {"city": "Vancouver", "country": "Canada", "lat": 49.2827, "lng": -123.1207},
          // {"city": "Chicago", "country": "USA", "lat": 41.8781, "lng": -87.6298},
          // {"city": "Miami", "country": "USA", "lat": 25.7617, "lng": -80.1918},
          // {"city": "San Francisco", "country": "USA", "lat": 37.7749, "lng": -122.4194},
          // {"city": "Seattle", "country": "USA", "lat": 47.6062, "lng": -122.3321},
          // {"city": "Dallas", "country": "USA", "lat": 32.7767, "lng": -96.7970},
          // {"city": "Atlanta", "country": "USA", "lat": 33.7490, "lng": -84.3880},
          // {"city": "Boston", "country": "USA", "lat": 42.3601, "lng": -71.0589},
          // {"city": "Las Vegas", "country": "USA", "lat": 36.1699, "lng": -115.1398},
          // {"city": "Phoenix", "country": "USA", "lat": 33.4484, "lng": -112.0740},
          // {"city": "Denver", "country": "USA", "lat": 39.7392, "lng": -104.9903}
        ];
        
        // Randomly select 8-15 locations from the comprehensive list
        const randomCount = Math.floor(Math.random() * 8) + 8; // 8 to 15 locations
        const shuffled = [...mockLocations].sort(() => Math.random() - 0.5);
        const selectedLocations = shuffled.slice(0, randomCount);
        
        setLocations(selectedLocations);
      } catch (err: any) {
        console.error('Error fetching store locations:', err);
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
            setLocationError(null); // Clear any previous errors
          },
          (error) => {
            console.error('Error getting user location:', error);
            let errorMessage = 'Unable to get your location. ';
            
            switch (error.code) {
              case error.PERMISSION_DENIED:
                errorMessage += 'Location access was denied. Click "Allow" if prompted, or use the manual direction options below.';
                break;
              case error.POSITION_UNAVAILABLE:
                errorMessage += 'Location information is unavailable. Please check your device settings.';
                break;
              case error.TIMEOUT:
                errorMessage += 'Location request timed out. Please try refreshing the page.';
                break;
              default:
                errorMessage += 'An unknown error occurred. You can still get directions manually.';
                break;
            }
            
            setLocationError(errorMessage);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000 // 5 minutes
          }
        );
      } else {
        setLocationError('Geolocation is not supported by this browser. You can still get directions manually.');
      }
    };

    fetchLocations();
    getUserLocation();
  }, []);

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const getDirections = (location: Location, method: 'google' | 'apple' | 'manual' = 'google') => {
    const destination = `${location.lat},${location.lng}`;
    const locationName = `${location.city}, ${location.country}`;
    
    let url: string;
    
    switch (method) {
      case 'google':
        if (userLocation) {
          url = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${destination}`;
        } else {
          // Fallback: Open Google Maps and let user enter their location
          url = `https://www.google.com/maps/dir//${destination}`;
        }
        break;
      case 'apple':
        if (userLocation) {
          url = `http://maps.apple.com/?saddr=${userLocation.lat},${userLocation.lng}&daddr=${destination}`;
        } else {
          // Fallback: Open Apple Maps to the destination
          url = `http://maps.apple.com/?daddr=${destination}`;
        }
        break;
      case 'manual':
        url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationName)}`;
        break;
      default:
        url = `https://www.google.com/maps/search/?api=1&query=${destination}`;
    }
    
    window.open(url, '_blank');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Address copied to clipboard!');
    }).catch(() => {
      alert('Could not copy address. Please copy manually.');
    });
  };

  const retryLocation = () => {
    setLocationError(null);
    setUserLocation(null);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Store Locations</h2>

      {locationError && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-yellow-700 text-sm">{locationError}</p>
              </div>
            </div>
            <button 
              onClick={retryLocation}
              className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded text-sm hover:bg-yellow-300 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading store locations...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-700 font-medium">Error: {error}</p>
        </div>
      ) : locations.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-600">No store locations found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {locations.map((loc, index) => {
            const distance = userLocation ? calculateDistance(userLocation.lat, userLocation.lng, loc.lat, loc.lng) : null;
            
            return (
              <div 
                key={`${loc.city}-${loc.lat}-${loc.lng}`} 
                className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 mb-1">
                      {loc.city}
                    </h3>
                    <p className="text-gray-600 mb-3">{loc.country}</p>
                    <div className="text-sm text-gray-500 mb-2">
                      <p>Latitude: {loc.lat.toFixed(4)}</p>
                      <p>Longitude: {loc.lng.toFixed(4)}</p>
                      {distance && (
                        <p className="text-blue-600 font-medium mt-1">
                          ~{distance.toFixed(1)} km away
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                    Store #{index + 1}
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex gap-2 mb-2">
                    <button 
                      onClick={() => getDirections(loc, 'google')}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-sm"
                      title={userLocation ? "Get turn-by-turn directions" : "Open in Google Maps"}
                    >
                      📍 Google Maps
                    </button>
                    <button 
                      onClick={() => getDirections(loc, 'apple')}
                      className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium text-sm"
                      title={userLocation ? "Get turn-by-turn directions" : "Open in Apple Maps"}
                    >
                      🍎 Apple Maps
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => getDirections(loc, 'manual')}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium text-sm"
                      title="Search for this location"
                    >
                      🔍 Search Location
                    </button>
                    <button 
                      onClick={() => copyToClipboard(`${loc.city}, ${loc.country}`)}
                      className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors duration-200 font-medium text-sm"
                      title="Copy address to clipboard"
                    >
                      📋 Copy Address
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StoreLocator;