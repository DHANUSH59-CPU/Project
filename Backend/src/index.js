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

io.on("connection", (socket) => {
  console.log("✅ New user connected:", socket.id);

  // Initialize user info
  socket.userInfo = {
    username: "Anonymous User",
    userId: null,
  };

  /* --------------------- Set user info --------------------- */
  socket.on("set-user-info", (data) => {
    socket.userInfo.username = data.username || "Anonymous User";
    socket.userInfo.userId = data.userId || null;
    console.log(
      `👤 User info set for ${socket.id}: ${socket.userInfo.username}`
    );
  });

  /* --------------------- Join Room --------------------- */
  socket.on("join-room", ({ roomId }) => {
    if (!roomId) return;
    const trimmedRoom = roomId.trim();
    socket.join(trimmedRoom);
    console.log(`🟢 ${socket.userInfo.username} joined room ${trimmedRoom}`);

    socket.to(trimmedRoom).emit("user-joined", {
      message: `${socket.userInfo.username} joined the room`,
      socketId: socket.id,
      username: socket.userInfo.username,
      userId: socket.userInfo.userId,
    });
  });

  /* --------------------- Leave Room --------------------- */
  socket.on("leave-room", ({ roomId }) => {
    if (!roomId) return;
    socket.leave(roomId);
    console.log(`🔴 ${socket.userInfo.username} left room ${roomId}`);

    socket.to(roomId).emit("user-left", {
      message: `${socket.userInfo.username} left the room`,
      socketId: socket.id,
      username: socket.userInfo.username,
      userId: socket.userInfo.userId,
    });
  });

  /* --------------------- Code Change --------------------- */
  socket.on("code-change", ({ roomId, code }) => {
    if (!roomId || typeof code !== "string") return;
    console.log(
      `💻 Code update in room ${roomId} by ${socket.userInfo.username}`
    );
    socket.to(roomId).emit("code-update", {
      code,
      from: socket.id,
      username: socket.userInfo.username,
      timestamp: new Date().toISOString(),
    });
  });

  /* --------------------- Language Change --------------------- */
  socket.on("language-change", ({ roomId, language }) => {
    if (!roomId) return;
    console.log(`🌐 Language change in ${roomId}: ${language}`);
    socket.to(roomId).emit("language-update", {
      language,
      from: socket.id,
      username: socket.userInfo.username,
    });
  });

  /* --------------------- Message Chat --------------------- */
  socket.on("message", (message) => {
    const rooms = Array.from(socket.rooms).filter((r) => r !== socket.id);
    rooms.forEach((roomId) => {
      socket.to(roomId).emit("message", {
        message,
        from: socket.id,
        username: socket.userInfo.username,
        timestamp: new Date().toISOString(),
      });
    });
  });

  /* --------------------- Disconnect --------------------- */
  socket.on("disconnect", (reason) => {
    console.log(`⚠️ User disconnected: ${socket.id} (${reason})`);
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
