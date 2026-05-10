import { Server } from "socket.io";
import type { Server as HttpServer } from "http";

let io: Server;

function getAllowedOrigins(): string | string[] {
  const raw = process.env.CLIENT_URL || "http://localhost:5173";
  const origins = raw.split(",").map((o) => o.trim());
  return origins.length === 1 ? origins[0] : origins;
}

export function initSocket(httpServer: HttpServer): Server {
  io = new Server(httpServer, {
    cors: {
      origin: getAllowedOrigins(),
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`[socket] connected: ${socket.id}`);

    // Client joins a chat room by chatId
    socket.on("join_chat", (chatId: string) => {
      socket.join(chatId);
    });

    socket.on("leave_chat", (chatId: string) => {
      socket.leave(chatId);
    });

    // Typing indicators
    socket.on("typing", ({ chatId, sender }: { chatId: string; sender: string }) => {
      socket.to(chatId).emit("typing", { chatId, sender });
    });

    socket.on("stop_typing", ({ chatId, sender }: { chatId: string; sender: string }) => {
      socket.to(chatId).emit("stop_typing", { chatId, sender });
    });

    socket.on("disconnect", () => {
      console.log(`[socket] disconnected: ${socket.id}`);
    });
  });

  return io;
}

export function getIO(): Server {
  if (!io) throw new Error("Socket.IO not initialized");
  return io;
}