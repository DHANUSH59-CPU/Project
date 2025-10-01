const Like = require("../models/like.model");
const Favorite = require("../models/favorite.model");
const Comment = require("../models/comment.model");
const Problem = require("../models/problem");
const User = require("../models/user.model");

// Like/Unlike Problem
const toggleLike = async (req, res) => {
  try {
    const { problemId } = req.params;
    const userId = req.userId;

    // Check if problem exists
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    // Check if user already liked the problem
    const existingLike = await Like.findOne({
      user: userId,
      problem: problemId,
    });

    if (existingLike) {
      // Unlike the problem
      await Like.findByIdAndDelete(existingLike._id);
      await Problem.findByIdAndUpdate(problemId, { $inc: { likesCount: -1 } });

      return res.json({
        message: "Problem unliked successfully",
        isLiked: false,
        likesCount: problem.likesCount - 1,
      });
    } else {
      // Like the problem
      await Like.create({ user: userId, problem: problemId });
      await Problem.findByIdAndUpdate(problemId, { $inc: { likesCount: 1 } });

      return res.json({
        message: "Problem liked successfully",
        isLiked: true,
        likesCount: problem.likesCount + 1,
      });
    }
  } catch (error) {
    console.error("Toggle like error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Favorite/Unfavorite Problem
const toggleFavorite = async (req, res) => {
  try {
    const { problemId } = req.params;
    const userId = req.userId;

    // Check if problem exists
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    // Check if user already favorited the problem
    const existingFavorite = await Favorite.findOne({
      user: userId,
      problem: problemId,
    });

    if (existingFavorite) {
      // Remove from favorites
      await Favorite.findByIdAndDelete(existingFavorite._id);
      await Problem.findByIdAndUpdate(problemId, {
        $inc: { favoritesCount: -1 },
      });

      return res.json({
        message: "Problem removed from favorites",
        isFavorited: false,
        favoritesCount: problem.favoritesCount - 1,
      });
    } else {
      // Add to favorites
      await Favorite.create({ user: userId, problem: problemId });
      await Problem.findByIdAndUpdate(problemId, {
        $inc: { favoritesCount: 1 },
      });

      return res.json({
        message: "Problem added to favorites",
        isFavorited: true,
        favoritesCount: problem.favoritesCount + 1,
      });
    }
  } catch (error) {
    console.error("Toggle favorite error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Add Comment
const addComment = async (req, res) => {
  try {
    const { problemId } = req.params;
    const { content, parentCommentId } = req.body;
    const userId = req.userId;

    // Check if problem exists
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    // Validate content
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: "Comment content is required" });
    }

    if (content.length > 1000) {
      return res
        .status(400)
        .json({ message: "Comment is too long (max 1000 characters)" });
    }

    // Create comment
    const comment = await Comment.create({
      user: userId,
      problem: problemId,
      content: content.trim(),
      parentComment: parentCommentId || null,
    });

    // Update problem comment count
    await Problem.findByIdAndUpdate(problemId, { $inc: { commentsCount: 1 } });

    // If it's a reply, update parent comment
    if (parentCommentId) {
      await Comment.findByIdAndUpdate(parentCommentId, {
        $push: { replies: comment._id },
      });
    }

    // Populate user info for response
    await comment.populate("user", "firstName lastName profileImageUrl");

    res.status(201).json({
      message: "Comment added successfully",
      comment: {
        _id: comment._id,
        content: comment.content,
        user: {
          _id: comment.user._id,
          firstName: comment.user.firstName,
          lastName: comment.user.lastName,
          profileImageUrl: comment.user.profileImageUrl,
        },
        createdAt: comment.createdAt,
        likes: comment.likes,
        replies: comment.replies,
        parentComment: comment.parentComment,
      },
    });
  } catch (error) {
    console.error("Add comment error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get Comments for a Problem
const getComments = async (req, res) => {
  try {
    const { problemId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    // Get top-level comments (not replies)
    const comments = await Comment.find({
      problem: problemId,
      parentComment: null,
      isDeleted: false,
    })
      .populate("user", "firstName lastName profileImageUrl")
      .populate({
        path: "replies",
        populate: {
          path: "user",
          select: "firstName lastName profileImageUrl",
        },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalComments = await Comment.countDocuments({
      problem: problemId,
      parentComment: null,
      isDeleted: false,
    });

    res.json({
      comments,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalComments / limit),
        totalComments,
        hasNext: skip + comments.length < totalComments,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Get comments error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Like/Unlike Comment
const toggleCommentLike = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.userId;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const isLiked = comment.likes.includes(userId);

    if (isLiked) {
      // Unlike the comment
      await Comment.findByIdAndUpdate(commentId, { $pull: { likes: userId } });
      res.json({ message: "Comment unliked", isLiked: false });
    } else {
      // Like the comment
      await Comment.findByIdAndUpdate(commentId, { $push: { likes: userId } });
      res.json({ message: "Comment liked", isLiked: true });
    }
  } catch (error) {
    console.error("Toggle comment like error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Edit Comment
const editComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.userId;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: "Comment content is required" });
    }

    if (content.length > 1000) {
      return res
        .status(400)
        .json({ message: "Comment is too long (max 1000 characters)" });
    }

    const comment = await Comment.findOne({
      _id: commentId,
      user: userId,
      isDeleted: false,
    });
    if (!comment) {
      return res.status(404).json({
        message: "Comment not found or you don't have permission to edit it",
      });
    }

    comment.content = content.trim();
    comment.isEdited = true;
    comment.editedAt = new Date();
    await comment.save();

    res.json({ message: "Comment updated successfully", comment });
  } catch (error) {
    console.error("Edit comment error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete Comment
const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.userId;

    const comment = await Comment.findOne({
      _id: commentId,
      user: userId,
      isDeleted: false,
    });
    if (!comment) {
      return res.status(404).json({
        message: "Comment not found or you don't have permission to delete it",
      });
    }

    // Soft delete
    comment.isDeleted = true;
    comment.deletedAt = new Date();
    comment.content = "[This comment has been deleted]";
    await comment.save();

    // Update problem comment count
    await Problem.findByIdAndUpdate(comment.problem, {
      $inc: { commentsCount: -1 },
    });

    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Delete comment error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get User's Liked Problems
const getLikedProblems = async (req, res) => {
  try {
    const userId = req.userId;
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const likes = await Like.find({ user: userId })
      .populate("problem")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalLikes = await Like.countDocuments({ user: userId });

    res.json({
      likedProblems: likes.map((like) => like.problem),
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalLikes / limit),
        totalLikes,
        hasNext: skip + likes.length < totalLikes,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Get liked problems error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get User's Favorite Problems
const getFavoriteProblems = async (req, res) => {
  try {
    const userId = req.userId;
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const favorites = await Favorite.find({ user: userId })
      .populate("problem")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalFavorites = await Favorite.countDocuments({ user: userId });

    res.json({
      favoriteProblems: favorites.map((favorite) => favorite.problem),
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalFavorites / limit),
        totalFavorites,
        hasNext: skip + favorites.length < totalFavorites,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Get favorite problems error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Check if user has liked/favorited a problem
const getProblemSocialStatus = async (req, res) => {
  try {
    const { problemId } = req.params;
    const userId = req.userId;

    const [isLiked, isFavorited] = await Promise.all([
      Like.findOne({ user: userId, problem: problemId }),
      Favorite.findOne({ user: userId, problem: problemId }),
    ]);

    res.json({
      isLiked: !!isLiked,
      isFavorited: !!isFavorited,
    });
  } catch (error) {
    console.error("Get problem social status error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  toggleLike,
  toggleFavorite,
  addComment,
  getComments,
  toggleCommentLike,
  editComment,
  deleteComment,
  getLikedProblems,
  getFavoriteProblems,
  getProblemSocialStatus,
};
