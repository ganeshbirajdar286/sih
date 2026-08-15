import { io } from "socket.io-client";

let socket = null;

export const initializeSocket = () => {
  const token = localStorage.getItem("auth_token");

  // IMPORTANT
  if (!token) {
    console.log("No token found");

    return null;
  }

  if (socket) return socket;

  const Backend_Socket_URL = import.meta.env.VITE_SOCKET_URL;
  console.trace();
  socket = io(
    Backend_Socket_URL,

    {
      auth: {
        token,
      },

      withCredentials: true,

      transports: ["websocket", "polling"],

      reconnectionAttempts: 5,

      reconnectionDelay: 1000,
    },
  );

   socket.on("connect", () => {
    console.log("Connected:", socket.id);

    const user = JSON.parse(localStorage.getItem("user"));

    if (user?._id) {
      socket.emit("register", {
        userId: user._id,
      });
    }
  });

  socket.on(
    "connect_error",

    (error) => {
      console.log("socket connection error", error);
    },
  );

  socket.on(
    "disconnect",

    (reason) => {
      console.log("socket disconnected ", reason);
    },
  );

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
