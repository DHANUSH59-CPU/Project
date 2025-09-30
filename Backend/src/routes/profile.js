const express = require("express");
const {
  getUserProfile,
  updateUserProfile,
  changePassword,
  getUserActivity,
  getUserAchievements,
} = require("../controllers/profile.controller");
const userMiddleware = require("../middleware/userMiddleware");

const profileRouter = express.Router();

// Get user profile with statistics
profileRouter.get("/", userMiddleware, getUserProfile);

// Update user profile
profileRouter.put("/", userMiddleware, updateUserProfile);

// Change password
profileRouter.put("/password", userMiddleware, changePassword);

// Get user activity history
profileRouter.get("/activity", userMiddleware, getUserActivity);

// Get user achievements
profileRouter.get("/achievements", userMiddleware, getUserAchievements);

module.exports = { profileRouter };
