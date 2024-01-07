// import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default icon issue with Leaflet in React
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
//   iconUrl: require('leaflet/dist/images/marker-icon.png'),
//   shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
// });

interface LocationMapProps {
  location: { latitude: number; longitude: number; } | null;
  title: string;
}

function LocationMap({ location, title }: LocationMapProps) {
  if (!location) {
    return <p>No address was provided.</p>;
  }

  return (
    <div className='border-gray overflow-hidden rounded-2xl border shadow-lg transition-shadow hover:shadow-xl'>
      <MapContainer 
        center={[location.latitude, location.longitude]} 
        zoom={15} 
        style={{ height: '400px', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[location.latitude, location.longitude]}>
          <Popup>
            {title}
          </Popup>
        </Marker>
      </MapContainer>
      
    </div>
  );
}

export default LocationMap;