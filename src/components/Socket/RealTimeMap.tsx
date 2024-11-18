import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L, { LatLngExpression } from "leaflet";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import "leaflet/dist/leaflet.css";
import IconsLocation from '../../assets/locationIconRed.jpg';
import IconsDurov from '../../assets/DuRovAva.jpeg';
// Tạo icon tùy chỉnh
const userIcon = L.icon({
  iconUrl: IconsDurov,
  iconSize: [50, 50], 
  iconAnchor: [25, 50], 
  popupAnchor: [0, -50], 
});

// Interface cho vị trí người dùng
interface UserLocation {
  userId: string;
  latitude: number;
  longitude: number;
}

// URL WebSocket server
const SOCKET_URL = "http://localhost:8080/ws-disaster-warning";

// Component để cập nhật tâm bản đồ
function ChangeView({ center }: { center: LatLngExpression }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center]);
  return null;
}

const RealTimeMap: React.FC = () => {
  const [positions, setPositions] = useState<{ [key: string]: UserLocation }>({});
  const [client, setClient] = useState<Client | null>(null);
  const [userPosition, setUserPosition] = useState<LatLngExpression>([21.0278, 105.8342]); // Vị trí mặc định

  useEffect(() => {
    // Tạo client STOMP
    const stompClient = new Client({
      brokerURL: SOCKET_URL,
      webSocketFactory: () => new SockJS(SOCKET_URL),
      onConnect: () => {
        console.log("Connected to WebSocket");

        // Đăng ký nhận vị trí từ server
        stompClient.subscribe("/topic/locations", (message) => {
          console.log("Received message", message);
          if (message.body) {
            const location: UserLocation = JSON.parse(message.body);
            setPositions((prevPositions) => ({
              ...prevPositions,
              [location.userId]: location,
            }));
          }
        });
      },
      onDisconnect: () => {
        console.log("Disconnected from WebSocket");
      },
    });

    // Kết nối WebSocket
    stompClient.activate();
    setClient(stompClient);

    return () => {
      stompClient.deactivate();
    };
  }, []);

  useEffect(() => {
    // Lấy vị trí hiện tại của người dùng
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // Cập nhật vị trí người dùng
        setUserPosition([latitude, longitude]);

        // Gửi vị trí lên server
        if (client && client.connected) {
          const userLocation: UserLocation = {
            userId: "user123", // Thay bằng ID người dùng thực tế
            latitude,
            longitude,
          };
          client.publish({
            destination: "/app/location", // Endpoint trên server
            body: JSON.stringify(userLocation),
          });
        }
      },
      (error) => {
        console.error("Error getting location", error);
      },
      {
        enableHighAccuracy: true,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [client]);

  return (
<div style={{ height: "100vh", width: "100%" }}>
  <MapContainer center={userPosition} zoom={16} style={{ height: "100%", width: "100%" }}>
    <ChangeView center={userPosition} />
    <TileLayer
      attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    {Object.values(positions).map((pos) => (
      <Marker
        key={pos.userId}
        position={[pos.latitude, pos.longitude]}
        icon={userIcon}
      >
        <Popup>{pos.userId}</Popup>
      </Marker>
    ))}
  </MapContainer>
</div>

  );
};

export default RealTimeMap;
