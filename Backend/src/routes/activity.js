const express = require("express");
const {
  getDailyActivity,
  getMonthlyTrends,
  getYearlyActivity,
  getUserChartStats,
} = require("../controllers/activity.controller");
const userMiddleware = require("../middleware/userMiddleware");

const activityRouter = express.Router();

// Get daily activity data for charts
activityRouter.get("/daily", userMiddleware, getDailyActivity);

// Get monthly submission trends
activityRouter.get("/monthly", userMiddleware, getMonthlyTrends);

// Get yearly activity heatmap data
activityRouter.get("/yearly", userMiddleware, getYearlyActivity);

// Get user statistics for charts
activityRouter.get("/stats", userMiddleware, getUserChartStats);

module.exports = { activityRouter };
