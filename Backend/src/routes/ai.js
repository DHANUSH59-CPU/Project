const express = require("express");
const { chatAI } = require("../controllers/ai.controller");
const userMiddleware = require("../middleware/userMiddleware");

const aiRouter = express.Router();

// AI chat endpoint - requires user authentication
aiRouter.post("/chatAI", userMiddleware, chatAI);

module.exports = { aiRouter };
