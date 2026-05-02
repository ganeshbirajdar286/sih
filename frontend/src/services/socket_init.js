import { io } from "socket.io-client";

let socket = null;

export const initializeSocket = () => {
  if (socket) return socket;

  const Backend_Socket_URL = import.meta.env.VITE_SOCKET_URL;
  socket = io(Backend_Socket_URL, {
    auth:{
      token:localStorage.getItem("auth_token")
    },
    withCredentials: true,
    transports: ["websocket", "polling"],
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  socket.on("connect",()=>{
    console.log("Connected to backend socket server with ID:", socket.id);
  })

   socket.on("connect_error", (error) => {
    console.log("socket connection error", error);
  });

  //disconnect events
  socket.on("disconnect", (reason) => {
    console.log("socket disconnected ", reason);
  });

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    return initializeSocket();
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};