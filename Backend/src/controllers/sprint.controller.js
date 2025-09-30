const Sprint = require("../models/sprint.model");
const SprintProgress = require("../models/sprintProgress.model");
const User = require("../models/user.model");
const Problem = require("../models/problem");

// Get all sprints with filtering
const getAllSprints = async (req, res) => {
  try {
    const {
      category,
      difficulty,
      page = 1,
      limit = 10,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const skip = (page - 1) * limit;
    const query = { isActive: true };

    // Apply filters
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    const sprints = await Sprint.find(query)
      .populate("problems", "title difficulty tags")
      .populate("createdBy", "firstName lastName")
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const totalSprints = await Sprint.countDocuments(query);

    // Get user's progress for each sprint (only if user is authenticated)
    let userProgress = [];
    if (req.result && req.result._id) {
      const userId = req.result._id;
      userProgress = await SprintProgress.find({
        userId,
        sprintId: { $in: sprints.map((s) => s._id) },
      });
    }

    const sprintsWithProgress = sprints.map((sprint) => {
      const progress = userProgress.find(
        (p) => p.sprintId.toString() === sprint._id.toString()
      );
      return {
        ...sprint.toObject(),
        userProgress: progress
          ? {
              status: progress.status,
              progressPercentage: progress.progressPercentage,
              problemsSolvedCount: progress.problemsSolvedCount,
              isCompleted: progress.isCompleted,
            }
          : null,
      };
    });

    res.status(200).json({
      sprints: sprintsWithProgress,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalSprints / limit),
        totalSprints,
        hasNext: skip + sprints.length < totalSprints,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single sprint with details
const getSprintById = async (req, res) => {
  try {
    const { sprintId } = req.params;
    const userId = req.result._id;

    const sprint = await Sprint.findById(sprintId)
      .populate("problems", "title difficulty tags description testCases")
      .populate("createdBy", "firstName lastName profileImageUrl");

    if (!sprint) {
      return res.status(404).json({ error: "Sprint not found" });
    }

    // Get user's progress
    const userProgress = await SprintProgress.findOne({
      userId,
      sprintId,
    });

    const sprintWithProgress = {
      ...sprint.toObject(),
      userProgress: userProgress
        ? {
            status: userProgress.status,
            progressPercentage: userProgress.progressPercentage,
            problemsSolved: userProgress.problemsSolved,
            problemsSolvedCount: userProgress.problemsSolvedCount,
            totalTimeSpent: userProgress.totalTimeSpent,
            currentStreak: userProgress.currentStreak,
            longestStreak: userProgress.longestStreak,
            isCompleted: userProgress.isCompleted,
            startedAt: userProgress.startedAt,
            completedAt: userProgress.completedAt,
          }
        : null,
    };

    res.status(200).json(sprintWithProgress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Start a sprint
const startSprint = async (req, res) => {
  try {
    const { sprintId } = req.params;
    const userId = req.result._id;

    const sprint = await Sprint.findById(sprintId);
    if (!sprint) {
      return res.status(404).json({ error: "Sprint not found" });
    }

    // Check if user already has progress for this sprint
    const existingProgress = await SprintProgress.findOne({
      userId,
      sprintId,
    });

    if (existingProgress) {
      if (existingProgress.status === "completed") {
        return res.status(400).json({ error: "Sprint already completed" });
      }
      if (existingProgress.status === "in_progress") {
        return res.status(400).json({ error: "Sprint already in progress" });
      }
    }

    // Create or update progress
    const progress =
      existingProgress ||
      new SprintProgress({
        userId,
        sprintId,
        status: "in_progress",
        startedAt: new Date(),
        lastActivityAt: new Date(),
      });

    if (existingProgress) {
      progress.status = "in_progress";
      progress.startedAt = new Date();
      progress.lastActivityAt = new Date();
    }

    await progress.save();

    res.status(200).json({
      message: "Sprint started successfully",
      progress: {
        status: progress.status,
        startedAt: progress.startedAt,
        progressPercentage: progress.progressPercentage,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update sprint progress when problem is solved
const updateSprintProgress = async (userId, problemId, timeSpent = 0) => {
  try {
    // Find all active sprints containing this problem
    const sprints = await Sprint.find({
      problems: problemId,
      isActive: true,
    });

    for (const sprint of sprints) {
      let progress = await SprintProgress.findOne({
        userId,
        sprintId: sprint._id,
        status: "in_progress",
      });

      if (!progress) continue;

      // Check if problem already solved in this sprint
      const alreadySolved = progress.problemsSolved.find(
        (p) => p.problemId.toString() === problemId.toString()
      );

      if (alreadySolved) continue;

      // Add problem to solved list
      progress.problemsSolved.push({
        problemId,
        solvedAt: new Date(),
        timeSpent,
      });

      // Update progress percentage
      progress.progressPercentage = Math.round(
        (progress.problemsSolved.length / sprint.problems.length) * 100
      );

      // Update streaks
      progress.currentStreak += 1;
      progress.longestStreak = Math.max(
        progress.longestStreak,
        progress.currentStreak
      );

      // Check if sprint is completed
      if (progress.problemsSolved.length === sprint.problems.length) {
        progress.status = "completed";
        progress.completedAt = new Date();

        // Award completion rewards
        if (sprint.completionReward) {
          const user = await User.findById(userId);

          if (sprint.completionReward.type === "points") {
            user.points += sprint.completionReward.value || sprint.points;
            progress.rewardsEarned.push({
              type: "points",
              value: sprint.completionReward.value || sprint.points,
              earnedAt: new Date(),
            });
          } else if (sprint.completionReward.type === "badge") {
            // Add badge logic here
            progress.rewardsEarned.push({
              type: "badge",
              badgeName: sprint.completionReward.badgeName,
              earnedAt: new Date(),
            });
          }

          await user.save();
        }
      }

      progress.lastActivityAt = new Date();
      await progress.save();
    }
  } catch (error) {
    // Silent error handling for background process
  }
};

// Get user's sprint statistics
const getUserSprintStats = async (req, res) => {
  try {
    const userId = req.result._id;

    const stats = await SprintProgress.aggregate([
      { $match: { userId: userId } },
      {
        $group: {
          _id: null,
          totalSprintsStarted: { $sum: 1 },
          totalSprintsCompleted: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
          },
          totalProblemsSolved: { $sum: { $size: "$problemsSolved" } },
          totalTimeSpent: { $sum: "$totalTimeSpent" },
          averageCompletionRate: { $avg: "$progressPercentage" },
          longestStreak: { $max: "$longestStreak" },
        },
      },
    ]);

    const categoryStats = await SprintProgress.aggregate([
      { $match: { userId: userId, status: "completed" } },
      {
        $lookup: {
          from: "sprints",
          localField: "sprintId",
          foreignField: "_id",
          as: "sprint",
        },
      },
      { $unwind: "$sprint" },
      {
        $group: {
          _id: "$sprint.category",
          completedCount: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      overall: stats[0] || {
        totalSprintsStarted: 0,
        totalSprintsCompleted: 0,
        totalProblemsSolved: 0,
        totalTimeSpent: 0,
        averageCompletionRate: 0,
        longestStreak: 0,
      },
      byCategory: categoryStats,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get sprint leaderboard
const getSprintLeaderboard = async (req, res) => {
  try {
    const { sprintId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const leaderboard = await SprintProgress.aggregate([
      { $match: { sprintId: sprintId, status: "completed" } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          userId: 1,
          firstName: "$user.firstName",
          lastName: "$user.lastName",
          profileImageUrl: "$user.profileImageUrl",
          completedAt: 1,
          totalTimeSpent: 1,
          problemsSolvedCount: { $size: "$problemsSolved" },
        },
      },
      { $sort: { completedAt: 1 } }, // First to complete wins
      { $skip: skip },
      { $limit: parseInt(limit) },
    ]);

    const totalCompleted = await SprintProgress.countDocuments({
      sprintId,
      status: "completed",
    });

    res.status(200).json({
      leaderboard,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCompleted / limit),
        totalCompleted,
        hasNext: skip + leaderboard.length < totalCompleted,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllSprints,
  getSprintById,
  startSprint,
  updateSprintProgress,
  getUserSprintStats,
  getSprintLeaderboard,
};
