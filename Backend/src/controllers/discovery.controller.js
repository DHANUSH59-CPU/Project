const User = require("../models/user.model");
const ConnectionRequest = require("../models/connectionRequest.model");
const mongoose = require("mongoose");

// Safe data fields to expose for user discovery
const USER_SAFE_DATA = "firstName lastName age profileImageUrl problemSolved";

// Get discoverable users (excluding already connected/requested users)
const getDiscoverableUsers = async (req, res) => {
  try {
    const loggedInUser = req.user || { _id: req.userId };
    const currentUserId = new mongoose.Types.ObjectId(req.userId);

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    // Find all connection requests involving the logged-in user
    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: currentUserId }, { toUserId: currentUserId }],
    }).select("fromUserId toUserId");

    // Create a set of user IDs to hide from feed
    const hideUsersFromFeed = new Set();
    hideUsersFromFeed.add(currentUserId.toString()); // Always exclude current user

    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    // Get users with their problem-solving statistics
    const users = await User.aggregate([
      {
        $match: {
          _id: {
            $nin: Array.from(hideUsersFromFeed).map(
              (id) => new mongoose.Types.ObjectId(id)
            ),
          },
        },
      },
      {
        $addFields: {
          problemsSolved: { $size: "$problemSolved" },
        },
      },
      {
        $project: {
          firstName: 1,
          lastName: 1,
          age: 1,
          profileImageUrl: 1,
          problemsSolved: 1,
          createdAt: 1,
        },
      },
      { $skip: skip },
      { $limit: limit },
    ]);

    res.json({
      success: true,
      data: users,
      pagination: {
        currentPage: page,
        limit,
        hasMore: users.length === limit,
      },
    });
  } catch (err) {
    console.error("Error in getDiscoverableUsers:", err);
    res.status(400).json({
      success: false,
      error: "Failed to fetch discoverable users: " + err.message,
    });
  }
};

// Send connection request
const sendConnectionRequest = async (req, res) => {
  try {
    const loggedInUser = req.user || { _id: req.userId };
    const fromUserId = loggedInUser._id;
    const { status, toUserId } = req.params;

    // Validate toUserId
    if (!mongoose.Types.ObjectId.isValid(toUserId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid User ID",
      });
    }

    // Check if target user exists
    const targetUser = await User.findById(toUserId);
    if (!targetUser) {
      return res.status(400).json({
        success: false,
        error: "User not found",
      });
    }

    // Check if trying to send request to self
    if (fromUserId.toString() === toUserId) {
      return res.status(400).json({
        success: false,
        error: "You cannot send request to yourself",
      });
    }

    // Validate status
    const allowedStatus = ["interested", "ignored"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Invalid status type: ${status}`,
      });
    }

    // Check if connection request already exists
    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });

    if (existingConnectionRequest) {
      return res.status(400).json({
        success: false,
        error: "Connection request already exists",
      });
    }

    // Create new connection request
    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });

    await connectionRequest.save();

    const message =
      status === "interested"
        ? "Connection request sent successfully"
        : "User ignored successfully";

    res.status(200).json({
      success: true,
      message,
      data: connectionRequest,
    });
  } catch (err) {
    console.error("Error in sendConnectionRequest:", err);
    res.status(400).json({
      success: false,
      error: "Failed to send connection request: " + err.message,
    });
  }
};

// Get received connection requests
const getReceivedRequests = async (req, res) => {
  try {
    const loggedInUser = req.user || { _id: req.userId };
    const currentUserId = new mongoose.Types.ObjectId(req.userId);

    // Use aggregation to get requests with problemsSolved count directly
    const connectionRequests = await ConnectionRequest.aggregate([
      {
        $match: {
          toUserId: currentUserId,
          status: "interested",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "fromUserId",
          foreignField: "_id",
          as: "fromUser",
        },
      },
      {
        $addFields: {
          fromUser: { $arrayElemAt: ["$fromUser", 0] },
        },
      },
      {
        $addFields: {
          "fromUser.problemsSolved": { $size: "$fromUser.problemSolved" },
        },
      },
      {
        $project: {
          _id: 1,
          fromUserId: 1,
          toUserId: 1,
          status: 1,
          createdAt: 1,
          updatedAt: 1,
          fromUserId: {
            _id: "$fromUser._id",
            firstName: "$fromUser.firstName",
            lastName: "$fromUser.lastName",
            age: "$fromUser.age",
            profileImageUrl: "$fromUser.profileImageUrl",
            problemsSolved: "$fromUser.problemsSolved",
          },
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    // Format the response
    const requestsWithStats = connectionRequests;

    res.json({
      success: true,
      message: "Received requests fetched successfully",
      data: requestsWithStats,
    });
  } catch (err) {
    console.error("Error in getReceivedRequests:", err);
    res.status(400).json({
      success: false,
      error: "Failed to fetch received requests: " + err.message,
    });
  }
};

// Review connection request (accept/reject)
const reviewConnectionRequest = async (req, res) => {
  try {
    const loggedInUser = req.user || { _id: req.userId };
    const { status, requestUserId } = req.params;

    // Validate requestUserId
    if (!mongoose.Types.ObjectId.isValid(requestUserId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid Request User ID",
      });
    }

    // Validate status
    const allowedStatus = ["accepted", "rejected"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Invalid status type: ${status}`,
      });
    }

    // Find the connection request with status "interested"
    const connectionRequest = await ConnectionRequest.findOne({
      fromUserId: requestUserId,
      toUserId: loggedInUser._id,
      status: "interested",
    });

    if (!connectionRequest) {
      return res.status(400).json({
        success: false,
        error: "Invalid connection request",
      });
    }

    // Update the status
    connectionRequest.status = status;
    await connectionRequest.save();

    const message =
      status === "accepted"
        ? "Connection request accepted"
        : "Connection request rejected";

    res.status(200).json({
      success: true,
      message,
      data: connectionRequest,
    });
  } catch (err) {
    console.error("Error in reviewConnectionRequest:", err);
    res.status(400).json({
      success: false,
      error: "Failed to review connection request: " + err.message,
    });
  }
};

// Get all connections (accepted requests)
const getConnections = async (req, res) => {
  try {
    const loggedInUser = req.user || { _id: req.userId };
    const currentUserId = new mongoose.Types.ObjectId(req.userId);

    // Use aggregation to get connections with problemsSolved count directly
    const connections = await ConnectionRequest.aggregate([
      {
        $match: {
          $or: [
            { fromUserId: currentUserId, status: "accepted" },
            { toUserId: currentUserId, status: "accepted" },
          ],
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "fromUserId",
          foreignField: "_id",
          as: "fromUser",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "toUserId",
          foreignField: "_id",
          as: "toUser",
        },
      },
      {
        $addFields: {
          fromUser: { $arrayElemAt: ["$fromUser", 0] },
          toUser: { $arrayElemAt: ["$toUser", 0] },
        },
      },
      {
        $addFields: {
          "fromUser.problemsSolved": { $size: "$fromUser.problemSolved" },
          "toUser.problemsSolved": { $size: "$toUser.problemSolved" },
        },
      },
      {
        $project: {
          _id: 1,
          fromUserId: "$fromUser._id",
          toUserId: "$toUser._id",
          status: 1,
          createdAt: 1,
          updatedAt: 1,
          fromUser: {
            _id: 1,
            firstName: 1,
            lastName: 1,
            age: 1,
            profileImageUrl: 1,
            problemsSolved: 1,
          },
          toUser: {
            _id: 1,
            firstName: 1,
            lastName: 1,
            age: 1,
            profileImageUrl: 1,
            problemsSolved: 1,
          },
        },
      },
      { $sort: { updatedAt: -1 } },
    ]);

    if (!connections || connections.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No connections found",
        data: [],
      });
    }

    // Format the response to match the expected structure
    const connectionsWithStats = connections.map((connection) => {
      const connectedUser =
        connection.fromUserId.toString() === currentUserId.toString()
          ? connection.toUser
          : connection.fromUser;

      return {
        _id: connection._id,
        fromUserId: connection.fromUser,
        toUserId: connection.toUser,
        status: connection.status,
        createdAt: connection.createdAt,
        updatedAt: connection.updatedAt,
        connectedUser,
      };
    });

    res.status(200).json({
      success: true,
      data: connectionsWithStats,
    });
  } catch (err) {
    console.error("Error in getConnections:", err);
    res.status(400).json({
      success: false,
      error: "Failed to fetch connections: " + err.message,
    });
  }
};

module.exports = {
  getDiscoverableUsers,
  sendConnectionRequest,
  getReceivedRequests,
  reviewConnectionRequest,
  getConnections,
};
