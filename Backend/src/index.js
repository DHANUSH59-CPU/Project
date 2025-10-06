/**
 * AlgoMaster Backend API
 * Competitive Programming Platform with Social Features
 */

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const { createServer } = require("http");
const { Server } = require("socket.io");

const { connectDB } = require("./config/connectDB");
const redisClient = require("./config/redis");

const { authRouter } = require("./routes/auth");
const { problemRouter } = require("./routes/problemRouter");
const { submitRouter } = require("./routes/submissionRouter");
const { aiRouter } = require("./routes/ai");
const { leaderboardRouter } = require("./routes/leaderboard");
const { sprintRouter } = require("./routes/sprint");
const { profileRouter } = require("./routes/profile");
const { activityRouter } = require("./routes/activity");
const { socialRouter } = require("./routes/social");
const videoRouter = require("./routes/video");
const discoveryRouter = require("./routes/discovery");

dotenv.config();
const PORT = process.env.PORT || 5000;

const app = express();
const server = createServer(app);

// Simple Socket.IO setup (no authentication for now)
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://devmtxh.xyz",
      "https://devmtxh.xyz",
    ], // Allow both frontend ports and production domain
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(express.json());
app.use(cookieParser()); // Used to deconstruct the token from cookie

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://127.0.0.1:5173",
      "http://127.0.0.1:5174",
      "http://devmtxh.xyz",
      "https://devmtxh.xyz",
    ], // Allow both frontend ports, localhost variants, and production domain
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  })
);

// app.use("/", (req, res) => {
//   res.send("Hello world");
// });

app.use("/user", authRouter);
app.use("/problem", problemRouter);
app.use("/submission", submitRouter);
app.use("/ai", aiRouter);
app.use("/leaderboard", leaderboardRouter);
app.use("/sprint", sprintRouter);
app.use("/profile", profileRouter);
app.use("/activity", activityRouter);
app.use("/social", socialRouter);
app.use("/video", videoRouter);
app.use("/", discoveryRouter);

const InitizializeConnection = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log("MongoDB Connected");

    // Try to connect to Redis (optional)
    try {
      await redisClient.connect();
      console.log("Redis Connected");
    } catch (redisError) {
      console.log(
        "Redis connection failed, continuing without Redis:",
        redisError.message
      );
    }

    console.log("DB'S Connected");

    // Simple Socket.IO connection handler with room logic
    io.on("connection", (socket) => {
      console.log("User connected:", socket.id);

      // Store user info when they connect
      socket.userInfo = {
        socketId: socket.id,
        username: "Anonymous User", // Default until we get real user info
        userId: null,
      };

      // Set user info
      socket.on("set-user-info", (data) => {
        socket.userInfo = {
          socketId: socket.id,
          username: data.username || "Anonymous User",
          userId: data.userId || null,
        };
        console.log(
          `User info set: ${socket.userInfo.username} (${socket.id})`
        );
      });

      // Join room
      socket.on("join-room", (data) => {
        const { roomId } = data;
        if (roomId) {
          socket.join(roomId);
          console.log(
            `User ${socket.userInfo.username} (${socket.id}) joined room: ${roomId}`
          );

          // Get all users currently in the room
          const room = io.sockets.adapter.rooms.get(roomId);
          const usersInRoom = [];
          if (room) {
            for (const socketId of room) {
              const userSocket = io.sockets.sockets.get(socketId);
              if (userSocket && userSocket.userInfo) {
                usersInRoom.push({
                  socketId: userSocket.id,
                  username: userSocket.userInfo.username,
                  userId: userSocket.userInfo.userId,
                });
              }
            }
          }

          // Notify others in the room
          socket.to(roomId).emit("user-joined", {
            message: `${socket.userInfo.username} joined the room`,
            socketId: socket.id,
            username: socket.userInfo.username,
            userId: socket.userInfo.userId,
          });

          // Send confirmation to the user with current room users
          socket.emit("room-joined", {
            roomId,
            message: `You joined room: ${roomId}`,
            usersInRoom: usersInRoom,
          });
        }
      });

      // Leave room
      socket.on("leave-room", (data) => {
        const { roomId } = data;
        if (roomId) {
          socket.leave(roomId);
          console.log(
            `User ${socket.userInfo.username} (${socket.id}) left room: ${roomId}`
          );

          // Notify others in the room
          socket.to(roomId).emit("user-left", {
            message: `${socket.userInfo.username} left the room`,
            socketId: socket.id,
            username: socket.userInfo.username,
            userId: socket.userInfo.userId,
          });
        }
      });

      // Handle messages
      socket.on("message", (data) => {
        console.log(`Message from ${socket.userInfo.username}:`, data);

        // Broadcast to all clients in the same room
        const rooms = Array.from(socket.rooms);
        rooms.forEach((room) => {
          if (room !== socket.id) {
            // Don't broadcast to the sender's personal room
            socket.to(room).emit("message", {
              message: data,
              from: socket.id,
              username: socket.userInfo.username,
              userId: socket.userInfo.userId,
              timestamp: new Date().toISOString(),
            });
          }
        });
      });

      // Handle code changes
      socket.on("code-change", (data) => {
        const { roomId, code } = data;
        console.log(
          `Code change by ${socket.userInfo.username} in room ${roomId}:`,
          code.substring(0, 50) + "..."
        );

        // Broadcast code changes to all clients in the same room
        socket.to(roomId).emit("code-update", {
          code,
          from: socket.id,
          username: socket.userInfo.username,
          userId: socket.userInfo.userId,
          timestamp: new Date().toISOString(),
        });
      });

      // Handle language changes
      socket.on("language-change", (data) => {
        const { roomId, language } = data;
        console.log(
          `Language change by ${socket.userInfo.username} in room ${roomId}: ${language}`
        );

        // Broadcast language changes to all clients in the same room
        socket.to(roomId).emit("language-update", {
          language,
          from: socket.id,
          username: socket.userInfo.username,
          userId: socket.userInfo.userId,
          timestamp: new Date().toISOString(),
        });
      });

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });

    server.listen(PORT, () => {
      console.log("Server is listening on port ", PORT);
      console.log("Socket.IO server is ready for connections");
    });
  } catch (err) {
    console.log("Error : ", err.message);
  }
};

InitizializeConnection();
