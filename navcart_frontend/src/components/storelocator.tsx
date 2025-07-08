import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L, { type LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix missing icon issue in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const stores = [
  {
    id: '1',
    name: 'Bentonville Supercenter',
    address: '102 N Walton Blvd',
    city: 'Bentonville',
    state: 'AR',
    latitude: 36.3729,
    longitude: -94.2088,
  },
  {
    id: '2',
    name: 'Tulsa Supercenter',
    address: '8800 E Pine St',
    city: 'Tulsa',
    state: 'OK',
    latitude: 36.114647,
    longitude: -95.926383,
  },
  {
    id: '3',
    name: 'Atlanta Supercenter',
    address: '235 Peachtree Rd NE',
    city: 'Atlanta',
    state: 'GA',
    latitude: 33.762909,
    longitude: -84.42348,
  },
];

const App = () => {
  const [showMap, setShowMap] = useState(false);
  const center: LatLngExpression = [20, 0];

  return (
    <div style={{ fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h1>NavCart Store Locator</h1>
      <button
        onClick={() => setShowMap((v) => !v)}
        style={{
          padding: '0.5rem 1rem',
          fontSize: '1rem',
          cursor: 'pointer',
          marginBottom: '1rem',
        }}
      >
        {showMap ? 'Hide Map' : 'Show Walmart Store Locator'}
      </button>

      {showMap && (
        <div
          style={{
            height: '80vh',
            width: '100%',
            maxWidth: 960,
            margin: '0 auto',
            borderRadius: 8,
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          }}
        >
          <MapContainer center={center} zoom={2} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {stores.map((store) => (
              <Marker key={store.id} position={[store.latitude, store.longitude]}>
                <Popup>
                  <strong>{store.name}</strong>
                  <br />
                  {store.address}
                  <br />
                  {store.city}, {store.state}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      )}
    </div>
  );
};

export default App;
