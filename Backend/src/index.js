/**
 * AlgoMaster Backend API
 * Competitive Programming Platform with Social + Collaborative Coding Features
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

/* -------------------------- ✅ CORS CONFIG -------------------------- */
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: [
      "https://algomaster-frontend-xy3n.onrender.com", // Render frontend
      "https://devmtxh.xyz", // optional custom domain
      "http://localhost:5173", // local dev
    ],
    credentials: true, // ✅ allow cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  })
);

/* -------------------------- ✅ ROUTES -------------------------- */
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

/* -------------------------- ✅ SOCKET.IO SETUP -------------------------- */
const io = new Server(server, {
  cors: {
    origin: [
      "https://algomaster-frontend-xy3n.onrender.com",
      "https://devmtxh.xyz",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket"], // ✅ Force pure WebSocket for Render
  allowEIO3: true,
});

// Real-Time Collaboration Logic (SmartCode Implementation)
const rooms = new Map();

io.on("connection", (socket) => {
  console.log("User Connected", socket.id);

  let currentRoom = null;
  let currentUser = null;

  socket.on("join", ({ roomId, userName }) => {
    if (currentRoom) {
      socket.leave(currentRoom);
      rooms.get(currentRoom)?.delete(currentUser);
      io.to(currentRoom).emit(
        "userJoined",
        Array.from(rooms.get(currentRoom) || [])
      );
    }

    currentRoom = roomId;
    currentUser = userName;

    socket.join(roomId);
    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Set());
    }
    rooms.get(roomId).add(userName);
    io.to(roomId).emit("userJoined", Array.from(rooms.get(roomId)));
  });

  socket.on("codeChange", ({ roomId, code }) => {
    socket.to(roomId).emit("codeUpdate", code);
  });

  socket.on("typing", ({ roomId, userName }) => {
    socket.to(roomId).emit("userTyping", userName);
  });

  socket.on("languageChange", ({ roomId, language }) => {
    io.to(roomId).emit("languageUpdate", language);
  });

  socket.on("leaveRoom", () => {
    if (currentRoom && currentUser) {
      rooms.get(currentRoom)?.delete(currentUser);
      io.to(currentRoom).emit(
        "userJoined",
        Array.from(rooms.get(currentRoom) || [])
      );
      socket.leave(currentRoom);
      currentRoom = null;
      currentUser = null;
    }
  });

  socket.on("disconnect", () => {
    if (currentRoom && currentUser) {
      rooms.get(currentRoom)?.delete(currentUser);
      io.to(currentRoom).emit(
        "userJoined",
        Array.from(rooms.get(currentRoom) || [])
      );
    }
    console.log("User Disconnected");
  });
});

/* -------------------------- ✅ INITIALIZE SERVER -------------------------- */
const InitializeConnection = async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB Connected");

    try {
      await redisClient.connect();
      console.log("✅ Redis Connected");
    } catch (redisError) {
      console.log("⚠️ Redis connection failed:", redisError.message);
    }

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log("🧩 Socket.IO ready for connections");
    });
  } catch (err) {
    console.error("❌ Server Error:", err.message);
  }
};

InitializeConnection();
