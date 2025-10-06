const express = require("express");
const {
  getAllSprints,
  getSprintById,
  startSprint,
  getUserSprintStats,
  getSprintLeaderboard,
} = require("../controllers/sprint.controller");
const {
  createSprint,
  getAllSprintsAdmin,
  updateSprint,
  deleteSprint,
  toggleSprintStatus,
} = require("../controllers/adminSprint.controller");
const userMiddleware = require("../middleware/userMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const sprintRouter = express.Router();

// Public routes (no authentication required)
sprintRouter.get("/", getAllSprints);

// Protected routes (authentication required)
sprintRouter.get("/:sprintId", userMiddleware, getSprintById);
sprintRouter.post("/:sprintId/start", userMiddleware, startSprint);
sprintRouter.get("/stats/user", userMiddleware, getUserSprintStats);
sprintRouter.get(
  "/:sprintId/leaderboard",
  userMiddleware,
  getSprintLeaderboard
);

// Admin routes (admin authentication required)
sprintRouter.post("/admin/create", adminMiddleware, createSprint);
sprintRouter.get("/admin/all", adminMiddleware, getAllSprintsAdmin);
sprintRouter.put("/admin/:sprintId", adminMiddleware, updateSprint);
sprintRouter.delete("/admin/:sprintId", adminMiddleware, deleteSprint);
sprintRouter.patch(
  "/admin/:sprintId/toggle",
  adminMiddleware,
  toggleSprintStatus
);

module.exports = { sprintRouter };
