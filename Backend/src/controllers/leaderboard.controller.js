const User = require("../models/user.model");
const Problem = require("../models/problem");

const getLeaderboard = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (page < 1) {
      return res.status(400).json({ error: "Page must be >= 1" });
    }

    if (limit < 10) {
      return res.status(400).json({ error: "Limit must be >= 10" });
    }

    // Get current user's data for ranking
    const user = await User.findById(req.result._id)
      .select("_id firstName lastName profileImageUrl points checkedProblems")
      .populate({
        path: "checkedProblems.pid",
        select: "_id title difficulty tags",
      });

    if (!user) {
      return res.status(400).send("User does not exist");
    }

    // Calculate user's rank - simple approach based on points only
    const usersAhead = await User.countDocuments({
      $or: [
        { points: { $gt: user.points } },
        {
          points: user.points,
          firstName: { $lt: user.firstName },
        },
      ],
    });

    const plainUser = user.toObject();
    plainUser.rank = usersAhead + 1;
    plainUser.solvedCount = user.checkedProblems.filter(
      (cp) => cp.isSolved
    ).length;

    // Get leaderboard data
    const leaderboard = await User.find({})
      .sort({
        points: -1,
        firstName: 1,
      })
      .skip(skip)
      .limit(limit)
      .select("_id firstName lastName profileImageUrl points checkedProblems")
      .populate({
        path: "checkedProblems.pid",
        select: "_id title difficulty",
      });

    // Calculate solved count for each user
    const leaderboardWithStats = leaderboard.map((user) => ({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      profileImageUrl: user.profileImageUrl,
      points: user.points,
      solvedCount: user.checkedProblems.filter((cp) => cp.isSolved).length,
      rank: skip + leaderboard.indexOf(user) + 1,
    }));

    const reply = {
      user: plainUser,
      leaderboard: leaderboardWithStats,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil((await User.countDocuments()) / limit),
        hasNext: page * limit < (await User.countDocuments()),
        hasPrev: page > 1,
      },
    };

    res.status(200).json(reply);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserStats = async (req, res) => {
  try {
    const user = await User.findById(req.result._id)
      .select(
        "_id firstName lastName profileImageUrl points checkedProblems streaks"
      )
      .populate({
        path: "checkedProblems.pid",
        select: "_id title difficulty tags",
      });

    if (!user) {
      return res.status(400).send("User does not exist");
    }

    const solvedProblems = user.checkedProblems.filter((cp) => cp.isSolved);
    const attemptedProblems = user.checkedProblems.filter((cp) => !cp.isSolved);

    // Calculate stats by difficulty
    const statsByDifficulty = {
      Easy: solvedProblems.filter((cp) => cp.pid.difficulty === "Easy").length,
      Medium: solvedProblems.filter((cp) => cp.pid.difficulty === "Medium")
        .length,
      Hard: solvedProblems.filter((cp) => cp.pid.difficulty === "Hard").length,
    };

    // Get total problems by difficulty for percentage calculation
    const totalProblemsByDifficulty = await Problem.aggregate([
      {
        $group: {
          _id: "$difficulty",
          count: { $sum: 1 },
        },
      },
    ]);

    const totalProblems = totalProblemsByDifficulty.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    const userStats = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      profileImageUrl: user.profileImageUrl,
      points: user.points,
      solvedCount: solvedProblems.length,
      attemptedCount: attemptedProblems.length,
      currentStreak: user.streaks.current,
      longestStreak: user.streaks.longest,
      statsByDifficulty,
      totalProblemsByDifficulty,
      solvedProblems: solvedProblems.map((cp) => ({
        _id: cp.pid._id,
        title: cp.pid.title,
        difficulty: cp.pid.difficulty,
        tags: cp.pid.tags,
        solvedDate: cp.submitDate,
      })),
    };

    res.status(200).json(userStats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUsersCount = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    res.status(200).json({ totalUsers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getLeaderboard,
  getUserStats,
  getUsersCount,
};
