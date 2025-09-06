const express = require("express");

const problemRouter = express.Router();

const adminMiddleware = require("../middleware/adminMiddleware");

const { createProblem } = require("../controllers/userProblem");

// Create => Only access to the admin
problemRouter.post("/create", adminMiddleware, createProblem);
// problemRouter.patch("/:id", updateProblem);
// problemRouter.delete("/:id", deleteProblem);

// problemRouter.get("/:id", getProblemById);
// problemRouter.get("/", getAllProblem);
// problemRouter.get("/user", solvedAllProblemByuser);

module.exports = { problemRouter };
