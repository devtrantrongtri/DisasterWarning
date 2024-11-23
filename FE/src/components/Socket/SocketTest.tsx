import React, { useEffect, useState } from "react";
import { Box, Typography, List, ListItem, ListItemText } from "@mui/material";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

// Kiểu dữ liệu của cảnh báo
interface DisasterWarning {
  id: string;
  message: string;
  timestamp: string;
}

// URL WebSocket server
const SOCKET_URL = "http://localhost:8080/ws-disaster-warning";

const SocketTest: React.FC = () => {
  const [warnings, setWarnings] = useState<DisasterWarning[]>([]);

  useEffect(() => {
    // Tạo client STOMP
    const client = new Client({
      brokerURL: SOCKET_URL, // Dùng SockJS fallback
      webSocketFactory: () => new SockJS(SOCKET_URL),
      onConnect: () => {
        console.log("Connected to WebSocket");

        // Đăng ký nhận tin nhắn từ topic "/topic/warnings"
        client.subscribe("/topic/warnings", (message) => {
          if (message.body) {
            const warning: DisasterWarning = JSON.parse(message.body);
            setWarnings((prev) => [warning, ...prev]); // Thêm cảnh báo mới
          }
        });
      },
      onDisconnect: () => {
        console.log("Disconnected from WebSocket");
      },
    });

    // Kết nối WebSocket
    client.activate();

    return () => {
      client.deactivate();
    };
  }, []);

  return (
    <Box sx={{ p: 3, maxWidth: 600, margin: "auto", border: "1px solid #ccc", borderRadius: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Disaster Warnings
      </Typography>

      {warnings.length === 0 ? (
        <Typography variant="body1" align="center">
          No warnings received yet.
        </Typography>
      ) : (
        <List>
          {warnings.map((warning) => (
            <ListItem key={warning.id} sx={{ borderBottom: "1px solid #eee" }}>
              <ListItemText
                primary={warning.message}
                secondary={new Date(warning.timestamp).toLocaleString()}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default SocketTest;
