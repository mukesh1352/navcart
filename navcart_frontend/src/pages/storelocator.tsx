import { useEffect, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import L, { type LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'react-leaflet-markercluster/dist/styles.min.css';

// Fix missing icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const storelocator = () => {
  const [showMap, setShowMap] = useState(false);
  const [stores, setStores] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const center: LatLngExpression = [37.8, -96]; // US center

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await fetch('/api/walmart-stores'); // Replace with actual backend or API
        const data = await response.json();
        setStores(data);
      } catch (error) {
        console.error('Failed to fetch stores:', error);
      }
    };

    fetchStores();
  }, []);

  const filteredStores = stores.filter((store) =>
    store.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h1>NavCart Store Locator</h1>

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Search stores..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: '0.5rem',
            fontSize: '1rem',
            borderRadius: 4,
            border: '1px solid #ccc',
            marginRight: 8,
          }}
        />
        <button
          onClick={() => setShowMap((v) => !v)}
          style={{
            padding: '0.5rem 1rem',
            fontSize: '1rem',
            cursor: 'pointer',
          }}
        >
          {showMap ? 'Hide Map' : 'Show Walmart Store Locator'}
        </button>
      </div>

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
          <MapContainer center={center} zoom={4} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MarkerClusterGroup>
              {filteredStores.map((store) => (
                <Marker
                  key={store.id}
                  position={[store.latitude, store.longitude]}
                >
                  <Popup>
                    <strong>{store.name}</strong>
                    <br />
                    {store.address}
                    <br />
                    {store.city}, {store.state}
                  </Popup>
                </Marker>
              ))}
            </MarkerClusterGroup>
          </MapContainer>
        </div>
      )}
    </div>
  );
};

export default storelocator;
