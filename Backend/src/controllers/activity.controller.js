const User = require("../models/user.model");
const Problem = require("../models/problem");
const submission = require("../models/submission.model");

// Get daily activity data for charts
const getDailyActivity = async (req, res) => {
  try {
    const userId = req.result._id;
    const { days = 14 } = req.query; // Default to 14 days

    // Get user's checked problems with populated data
    const user = await User.findById(userId).populate({
      path: "checkedProblems.pid",
      select: "difficulty",
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - parseInt(days));

    // Group problems by date and difficulty
    const dailyActivity = {};

    // Initialize all days in range with zero counts
    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      const dateStr = d.toISOString().split("T")[0];
      dailyActivity[dateStr] = {
        date: dateStr,
        easyCount: 0,
        mediumCount: 0,
        hardCount: 0,
        totalCount: 0,
      };
    }

    // Process solved problems
    user.checkedProblems.forEach((checkedProblem) => {
      if (checkedProblem.isSolved && checkedProblem.pid) {
        const solvedDate = new Date(checkedProblem.submitDate);
        const dateStr = solvedDate.toISOString().split("T")[0];

        if (dailyActivity[dateStr]) {
          const difficulty = checkedProblem.pid.difficulty;
          if (difficulty === "Easy") {
            dailyActivity[dateStr].easyCount++;
          } else if (difficulty === "Medium") {
            dailyActivity[dateStr].mediumCount++;
          } else if (difficulty === "Hard") {
            dailyActivity[dateStr].hardCount++;
          }
          dailyActivity[dateStr].totalCount++;
        }
      }
    });

    // Convert to array and sort by date
    const activityArray = Object.values(dailyActivity).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    res.status(200).json({
      activity: activityArray,
      totalDays: days,
      dateRange: {
        start: startDate.toISOString().split("T")[0],
        end: endDate.toISOString().split("T")[0],
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get monthly submission trends
const getMonthlyTrends = async (req, res) => {
  try {
    const userId = req.result._id;
    const { days = 30 } = req.query; // Default to 30 days

    // Get submissions from the last N days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - parseInt(days));

    const submissions = await submission
      .find({
        userId: userId,
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      })
      .sort({ createdAt: 1 });

    // Group submissions by date
    const dailyTrends = {};

    // Initialize all days in range
    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      const dateStr = d.toISOString().split("T")[0];
      dailyTrends[dateStr] = {
        date: dateStr,
        acceptedCount: 0,
        totalCount: 0,
      };
    }

    // Process submissions
    submissions.forEach((sub) => {
      const dateStr = sub.createdAt.toISOString().split("T")[0];
      if (dailyTrends[dateStr]) {
        dailyTrends[dateStr].totalCount++;
        if (sub.status === "accepted") {
          dailyTrends[dateStr].acceptedCount++;
        }
      }
    });

    // Convert to array and sort by date
    const trendsArray = Object.values(dailyTrends).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    res.status(200).json({
      trends: trendsArray,
      totalDays: days,
      dateRange: {
        start: startDate.toISOString().split("T")[0],
        end: endDate.toISOString().split("T")[0],
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get yearly activity heatmap data
const getYearlyActivity = async (req, res) => {
  try {
    const userId = req.result._id;
    const { year = new Date().getFullYear() } = req.query;

    // Get all solved problems for the year
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year, 11, 31);

    const user = await User.findById(userId).populate({
      path: "checkedProblems.pid",
      select: "difficulty",
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Create activity map for the year
    const yearlyActivity = {};

    // Initialize all days in the year with zero count
    for (
      let d = new Date(startOfYear);
      d <= endOfYear;
      d.setDate(d.getDate() + 1)
    ) {
      const dateStr = d.toISOString().split("T")[0];
      yearlyActivity[dateStr] = {
        date: dateStr,
        count: 0,
      };
    }

    // Process solved problems for the year
    user.checkedProblems.forEach((checkedProblem) => {
      if (checkedProblem.isSolved && checkedProblem.submitDate) {
        const solvedDate = new Date(checkedProblem.submitDate);
        if (solvedDate >= startOfYear && solvedDate <= endOfYear) {
          const dateStr = solvedDate.toISOString().split("T")[0];
          if (yearlyActivity[dateStr]) {
            yearlyActivity[dateStr].count++;
          }
        }
      }
    });

    // Convert to array and sort by date
    const activityArray = Object.values(yearlyActivity).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    res.status(200).json({
      activity: activityArray,
      year: year,
      totalSubmissions: activityArray.reduce((sum, day) => sum + day.count, 0),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user statistics for charts
const getUserChartStats = async (req, res) => {
  try {
    const userId = req.result._id;

    const user = await User.findById(userId).populate({
      path: "checkedProblems.pid",
      select: "difficulty",
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Calculate statistics by difficulty
    const solvedProblems = user.checkedProblems.filter((cp) => cp.isSolved);
    const attemptedProblems = user.checkedProblems.filter((cp) => !cp.isSolved);

    const statsByDifficulty = {
      Easy: solvedProblems.filter(
        (cp) => cp.pid && cp.pid.difficulty === "Easy"
      ).length,
      Medium: solvedProblems.filter(
        (cp) => cp.pid && cp.pid.difficulty === "Medium"
      ).length,
      Hard: solvedProblems.filter(
        (cp) => cp.pid && cp.pid.difficulty === "Hard"
      ).length,
    };

    // Get total problems by difficulty from database
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

    const chartStats = {
      solvedStats: {
        Easy: statsByDifficulty.Easy,
        Medium: statsByDifficulty.Medium,
        Hard: statsByDifficulty.Hard,
        totalSolved: solvedProblems.length,
        totalProblems: Object.values(totalProblems).reduce(
          (sum, count) => sum + count,
          0
        ),
        totalEasy: totalProblems.Easy || 0,
        totalMedium: totalProblems.Medium || 0,
        totalHard: totalProblems.Hard || 0,
      },
      streaks: {
        current: user.streaks?.current || 0,
        longest: user.streaks?.longest || 0,
      },
      points: user.points || 0,
      rank: user.rank || "N/A",
    };

    res.status(200).json(chartStats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getDailyActivity,
  getMonthlyTrends,
  getYearlyActivity,
  getUserChartStats,
};
