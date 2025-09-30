const express = require("express");
const {
  getLeaderboard,
  getUserStats,
  getUsersCount,
} = require("../controllers/leaderboard.controller");
const userMiddleware = require("../middleware/userMiddleware");

const leaderboardRouter = express.Router();

// Get leaderboard with pagination
leaderboardRouter.get("/", userMiddleware, getLeaderboard);

// Get user's detailed stats
leaderboardRouter.get("/stats", userMiddleware, getUserStats);

// Get total users count
leaderboardRouter.get("/users-count", userMiddleware, getUsersCount);

module.exports = { leaderboardRouter };


