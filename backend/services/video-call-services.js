import { Server } from "socket.io";
import{ socketMiddleware}  from "../middleware/socket.middleware.js";

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: [process.env.FRONTEND_URL, /\.vercel\.app$/],
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    },
    pingTimeout: 60000,
  });

  io.use(socketMiddleware);

  const userSocketMap = new Map(); // userId → socketId
  const callPairs = new Map();     // socketId → peer socketId

  io.on("connection", (socket) => {
    console.log("Connected:", socket.id);

   socket.on("register", ({ userId }) => {
  if (!userId) return;
  userSocketMap.set(userId.toString(), socket.id);

  // ✅ Broadcast updated online users map to all clients
  const onlineUsers = Object.fromEntries(userSocketMap);
  io.emit("online-users", onlineUsers); // { userId: socketId, ... }
});

    socket.on("call-user", ({ to, from, name, signal, fromUserId }) => {
  // "to" is already a socketId from the frontend, no need to look up
  const targetSocketId = to; // ✅ use directly

  if (!io.sockets.sockets.get(targetSocketId)) {
    socket.emit("user-offline");
    return;
  }

  callPairs.set(socket.id, targetSocketId);
  callPairs.set(targetSocketId, socket.id);

  io.to(targetSocketId).emit("incoming-call", {
    from: socket.id,
    fromUserId,
    name,
    signal,
  });
});

    socket.on("answer-call", ({ to, signal }) => {
      // "to" here should be the caller's socket.id (from incoming-call.from)
      io.to(to).emit("call-accepted", { signal });
    });

    // ✅ Fixed: route ICE candidates only to the paired peer
    socket.on("ice-candidate", ({ candidate }) => {
      const peerSocketId = callPairs.get(socket.id);
      if (peerSocketId) {
        io.to(peerSocketId).emit("ice-candidate", { candidate });
      }
    });

   socket.on("end-call", () => {
  const peerSocketId = callPairs.get(socket.id);
  if (peerSocketId) {
    io.to(peerSocketId).emit("call-ended");
    callPairs.delete(peerSocketId);
  }
  callPairs.delete(socket.id);

  // ✅ Broadcast updated map so frontend knows to re-register if needed
  const onlineUsers = Object.fromEntries(userSocketMap);
  io.emit("online-users", onlineUsers);
});

    socket.on("disconnect", () => {
  // Remove disconnected socket from map
  for (const [userId, socketId] of userSocketMap.entries()) {
    if (socketId === socket.id) {
      userSocketMap.delete(userId);
      break;
    }
  }

  // Clean up call pairs
  const peerSocketId = callPairs.get(socket.id);
  if (peerSocketId) {
    io.to(peerSocketId).emit("call-ended");
    callPairs.delete(peerSocketId);
  }
  callPairs.delete(socket.id);

  // Now broadcast accurate online users
  const onlineUsers = Object.fromEntries(userSocketMap);
  io.emit("online-users", onlineUsers);
});
  });

  return io;
};

export default initializeSocket;