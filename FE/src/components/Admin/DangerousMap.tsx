import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Dữ liệu giả với tên, nhiệt độ, và biểu tượng của các tỉnh ở Việt Nam
interface LocationData {
  name: string;
  temperature: number;
  coords: [number, number];
  icon: string;
}

const locationData: LocationData[] = [
  { name: 'Hà Nội', temperature: 30, coords: [21.0285, 105.8542], icon: '🌤️' },
  { name: 'Hồ Chí Minh', temperature: 34, coords: [10.8231, 106.6297], icon: '🌞' },
  { name: 'Đà Nẵng', temperature: 28, coords: [16.0471, 108.2068], icon: '⚡' },
  { name: 'Cần Thơ', temperature: 29, coords: [10.0452, 105.7469], icon: '☔' },
];

// Hàm tạo icon tùy chỉnh từ biểu tượng thời tiết
const createWeatherIcon = (icon: string) =>
  L.divIcon({
    html: `<span style="font-size: 50px;">${icon}</span>`,
    className: '',
    iconSize: [50, 50],
    iconAnchor: [25, 25],
  });

const DangerousLocationsMap: React.FC = () => {
  return (
    <MapContainer
      center={[15.8700, 107.8064]} // Tọa độ trung tâm bản đồ Việt Nam
      zoom={5}
      style={{ height: '450px', width: '100%' }}
      
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {locationData.map((location) => (
        <Marker
          key={location.name}
          position={location.coords}
          icon={createWeatherIcon(location.icon)} // Sử dụng icon tùy chỉnh theo điều kiện
        >
          <Popup>
            {location.icon} {location.name} - {location.temperature}°C
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default DangerousLocationsMap;
