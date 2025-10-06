const express = require("express");
const router = express.Router();
const userMiddleware = require("../middleware/userMiddleware");

// Import social controller functions
const socialController = require("../controllers/social.controller");

// Problem social features
router.post(
  "/problems/:problemId/like",
  userMiddleware,
  socialController.toggleLike
);
router.post(
  "/problems/:problemId/favorite",
  userMiddleware,
  socialController.toggleFavorite
);
router.get(
  "/problems/:problemId/status",
  userMiddleware,
  socialController.getProblemSocialStatus
);

// Comments
router.post(
  "/problems/:problemId/comments",
  userMiddleware,
  socialController.addComment
);
router.get(
  "/problems/:problemId/comments",
  userMiddleware,
  socialController.getComments
);
router.post(
  "/comments/:commentId/like",
  userMiddleware,
  socialController.toggleCommentLike
);
router.put(
  "/comments/:commentId",
  userMiddleware,
  socialController.editComment
);
router.delete(
  "/comments/:commentId",
  userMiddleware,
  socialController.deleteComment
);

// User social data
router.get(
  "/user/liked-problems",
  userMiddleware,
  socialController.getLikedProblems
);
router.get(
  "/user/favorite-problems",
  userMiddleware,
  socialController.getFavoriteProblems
);

module.exports = { socialRouter: router };
