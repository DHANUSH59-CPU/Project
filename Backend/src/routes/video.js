const express = require("express");
const videoRouter = express.Router();
const {
  getVideoSignature,
  saveVideoMetaData,
  getVideoSolution,
  deleteVideoSolution,
} = require("../controllers/video.controller");
const adminMiddleware = require("../middleware/adminMiddleware");
const userMiddleware = require("../middleware/userMiddleware");

// Admin-only routes (upload, save, delete) - specific routes first
videoRouter.get(
  "/upload/:problemId",
  userMiddleware,
  adminMiddleware,
  getVideoSignature
);
videoRouter.post(
  "/save/:problemId",
  userMiddleware,
  adminMiddleware,
  saveVideoMetaData
);
videoRouter.delete("/delete/:problemId", userMiddleware, deleteVideoSolution);

// Public route (get video solution) - must come last
videoRouter.get("/:problemId", getVideoSolution);

module.exports = videoRouter;
