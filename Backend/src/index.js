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

/* -------------------------- ✅ FIXED CORS CONFIG -------------------------- */
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: [
      "https://algomaster-frontend-xy3n.onrender.com", // Render frontend
      "https://devmtxh.xyz", // optional custom domain
      "http://localhost:5173", // local dev
    ],
    credentials: true, // <– REQUIRED for cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  })
);
/* ------------------------------------------------------------------------- */

/* --------------------------- ✅ SOCKET.IO CONFIG -------------------------- */
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
  transports: ["polling", "websocket"],
  pingTimeout: 60000,
  pingInterval: 25000,
});
/* ------------------------------------------------------------------------- */

/* --------------------------- ✅ ROUTES SETUP ------------------------------ */
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
/* ------------------------------------------------------------------------- */

/* -------------------------- ✅ DATABASE + REDIS -------------------------- */
const InitizializeConnection = async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB Connected");

    try {
      await redisClient.connect();
      console.log("✅ Redis Connected");
    } catch (redisError) {
      console.log("⚠️ Redis connection failed:", redisError.message);
    }

    console.log("✅ Databases initialized");

    /* ------------------------- SOCKET.IO HANDLERS ------------------------- */
    io.on("connection", (socket) => {
      console.log("User connected:", socket.id);

      socket.userInfo = {
        socketId: socket.id,
        username: "Anonymous",
        userId: null,
      };

      socket.on("set-user-info", (data) => {
        socket.userInfo = {
          socketId: socket.id,
          username: data.username || "Anonymous",
          userId: data.userId || null,
        };
        console.log(
          `User info set: ${socket.userInfo.username} (${socket.id})`
        );
      });

      socket.on("join-room", ({ roomId }) => {
        if (roomId) {
          socket.join(roomId);
          console.log(`${socket.userInfo.username} joined room: ${roomId}`);

          socket.to(roomId).emit("user-joined", {
            message: `${socket.userInfo.username} joined the room`,
            username: socket.userInfo.username,
            userId: socket.userInfo.userId,
          });
        }
      });

      socket.on("leave-room", ({ roomId }) => {
        if (roomId) {
          socket.leave(roomId);
          console.log(`${socket.userInfo.username} left room: ${roomId}`);
          socket.to(roomId).emit("user-left", {
            message: `${socket.userInfo.username} left the room`,
          });
        }
      });

      socket.on("message", (data) => {
        console.log(`Message from ${socket.userInfo.username}:`, data);
        const rooms = Array.from(socket.rooms);
        rooms.forEach((room) => {
          if (room !== socket.id) {
            socket.to(room).emit("message", {
              message: data,
              username: socket.userInfo.username,
              timestamp: new Date().toISOString(),
            });
          }
        });
      });

      socket.on("code-change", ({ roomId, code }) => {
        socket.to(roomId).emit("code-update", {
          code,
          username: socket.userInfo.username,
        });
      });

      socket.on("language-change", ({ roomId, language }) => {
        socket.to(roomId).emit("language-update", {
          language,
          username: socket.userInfo.username,
        });
      });

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });

    /* --------------------------------------------------------------------- */

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.log("❌ Error starting server:", err.message);
  }
};

InitizializeConnection();
