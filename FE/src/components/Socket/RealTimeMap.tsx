import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L, { LatLngExpression } from "leaflet";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import "leaflet/dist/leaflet.css";
import iconsMap from "../../assets/iconsMap.png";
import ReactDOMServer from 'react-dom/server';
import { Avatar } from '@mui/material';

const baseUrl = import.meta.env.VITE_BASE_URL_V1;

// Tạo icon tùy chỉnh
const userIcon = L.icon({
  iconUrl: iconsMap,
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
const SOCKET_URL = `${baseUrl}/ws-disaster-warning`;

// Component để cập nhật tâm bản đồ
function ChangeView({ center }: { center: LatLngExpression }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center]);
  return null;
}

const RealTimeMap: React.FC = () => {
  const [positions, setPositions] = useState<{ [key: string]: UserLocation }>(
    {}
  );
  const [client, setClient] = useState<Client | null>(null);
  const [userPosition, setUserPosition] = useState<LatLngExpression>([
    21.0278,
    105.8342,
  ]); // Vị trí mặc định

  useEffect(() => {
    // Tạo client STOMP
    const stompClient = new Client({
      brokerURL: SOCKET_URL,
      webSocketFactory: () => new SockJS(SOCKET_URL),
      onConnect: () => {
        console.log("Connected to WebSocket");

        // Đăng ký nhận danh sách vị trí từ server
        stompClient.subscribe("/topic/locations", (message) => {
          console.log("Received message", message);
          if (message.body) {
            const locations: UserLocation[] = JSON.parse(message.body);
            // Chuyển đổi danh sách thành một map
            const positionsMap: { [key: string]: UserLocation } = {};
            locations.forEach((location) => {
              positionsMap[location.userId] = location;
            });
            setPositions(positionsMap);
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
            userId: localStorage.getItem('userName') || 'Incognito',
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

  // Hàm xử lý khi nhấn vào người dùng trong danh sách
  const handleUserClick = (latitude: number, longitude: number) => {
    setUserPosition([latitude, longitude]);
  };

  return (
    <div style={{ display: "flex", height: "100vh", width: "100%" }}>
      {/* Thanh bên */}
      <div
        style={{
          width: "250px",
          backgroundColor: "#f8f9fa",
          borderRight: "1px solid #ddd",
          padding: "10px",
          overflowY: "auto",
        }}
      >
        <h3>Danh sách người dùng</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {Object.keys(positions).map((userId) => (
            <li
              key={userId}
              onClick={() =>
                handleUserClick(
                  positions[userId].latitude,
                  positions[userId].longitude
                )
              }
              style={{
                cursor: "pointer",
                padding: "10px",
                margin: "5px 0",
                backgroundColor: "#fff",
                borderRadius: "5px",
                boxShadow: "0 0 5px rgba(0, 0, 0, 0.1)",
              }}
            >
              {userId}
            </li>
          ))}
        </ul>
      </div>

      {/* Bản đồ */}
      <div style={{ flex: 1 }}>
        <MapContainer
          center={userPosition}
          zoom={16}
          style={{ height: "100%", width: "100%" }}
        >
          <ChangeView center={userPosition} />
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
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
    </div>
  );
};

export default RealTimeMap;
