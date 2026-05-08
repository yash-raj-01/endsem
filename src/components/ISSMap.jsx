import React from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom ISS Icon
const issIcon = new L.Icon({
  iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/International_Space_Station.svg',
  iconSize: [50, 50],
  iconAnchor: [25, 25],
});

// Component to recenter map
function ChangeView({ center }) {
  const map = useMap();
  map.setView(center);
  return null;
}

const ISSMap = ({ position, history }) => {
  if (!position || typeof position.latitude !== 'number' || typeof position.longitude !== 'number') {
    return (
      <div className="map-section glass-card" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Waiting for ISS location data...</p>
      </div>
    );
  }

  const center = [position.latitude, position.longitude];
  const polyline = (history || []).map((p) => [p.latitude, p.longitude]);

  return (
    <div className="map-section glass-card">
      <MapContainer
        center={center}
        zoom={3}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%', borderRadius: '0.75rem' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <ChangeView center={center} />
        <Polyline positions={polyline} color="#0ea5e9" weight={3} opacity={0.6} dashArray="5, 10" />
        <Marker position={center} icon={issIcon}>
          <Tooltip permanent direction="top" offset={[0, -20]}>
            ISS Location
          </Tooltip>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default ISSMap;
