// socket.ts
import { io } from "socket.io-client";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const socket = io(apiBaseUrl, {
  transports: ["websocket"],
  autoConnect: true,
});

export default socket;
