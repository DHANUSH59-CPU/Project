const express = require("express");
const discoveryRouter = express.Router();
const {
  getDiscoverableUsers,
  sendConnectionRequest,
  getReceivedRequests,
  reviewConnectionRequest,
  getConnections,
} = require("../controllers/discovery.controller");
const userMiddleware = require("../middleware/userMiddleware");

// Get discoverable users (feed)
discoveryRouter.get("/discovery/users", userMiddleware, getDiscoverableUsers);

// Send connection request (interested/ignored)
discoveryRouter.post(
  "/discovery/request/send/:status/:toUserId",
  userMiddleware,
  sendConnectionRequest
);

// Get received connection requests
discoveryRouter.get(
  "/discovery/requests/received",
  userMiddleware,
  getReceivedRequests
);

// Review connection request (accept/reject)
discoveryRouter.post(
  "/discovery/request/review/:status/:requestUserId",
  userMiddleware,
  reviewConnectionRequest
);

// Get all connections
discoveryRouter.get("/discovery/connections", userMiddleware, getConnections);

module.exports = discoveryRouter;
