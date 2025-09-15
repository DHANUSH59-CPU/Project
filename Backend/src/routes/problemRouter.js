const express = require("express");

const problemRouter = express.Router();

const adminMiddleware = require("../middleware/adminMiddleware");
const userMiddleware = require("../middleware/userMiddleware");

const {
  createProblem,
  updateProblem,
  deleteProblem,
  fetchAllProblem,
  fetchProblemById,
  solvedAllProblemByuser,
  submittedProblem,
} = require("../controllers/userProblem");

// Create => Only access to the admin
problemRouter.post("/create", adminMiddleware, createProblem);
problemRouter.put("/update/:id", adminMiddleware, updateProblem);
problemRouter.delete("/delete/:id", adminMiddleware, deleteProblem);

problemRouter.get("/problemById/:id", userMiddleware, fetchProblemById);
problemRouter.get("/allProblems", userMiddleware, fetchAllProblem);
problemRouter.get(
  "/problemSolvedByUser",
  userMiddleware,
  solvedAllProblemByuser
);
problemRouter.get("/submittedProblem/:pid", userMiddleware, submittedProblem);

module.exports = { problemRouter };
