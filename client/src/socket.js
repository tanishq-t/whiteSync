/* eslint-disable no-undef */
import io from "socket.io-client";

const server =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://whitesync.onrender.com/";

console.log(server);

const connectionOptions = {
  "force new connection": true,
  reconnectionAttempts: "Infinity",
  timeout: 10000,
  transports: ["websocket"],
};

export const socket = io(server, connectionOptions);
