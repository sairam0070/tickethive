// src/api/socket.ts
import io from "socket.io-client";

export const socket = io(
  process.env.REACT_APP_BACKEND_URL || "http://localhost:5000",
  {
    transports: ["websocket"], // ensures WebSocket connection
  }
);

socket.on("connect", () => {
  console.log("Socket connected:", socket.id);
});

socket.on("connect_error", (err: any) => {
  console.error("Socket connection error:", err);
});
