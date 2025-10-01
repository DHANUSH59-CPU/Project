const User = require("../models/user.model");
const Problem = require("../models/problem");
const SprintProgress = require("../models/sprintProgress.model");
const bcrypt = require("bcrypt");
const cloudinary = require("../config/cloudinary");

// Get user profile with detailed statistics
const getUserProfile = async (req, res) => {
  try {
    const userId = req.result._id;

    const user = await User.findById(userId)
      .select(
        "-password -resetPasswordToken -resetPasswordExpiresAt -verificationToken -verificationTokenExpiresAt"
      )
      .populate({
        path: "problemSolved",
        select: "title difficulty tags",
        options: { limit: 10, sort: { createdAt: -1 } },
      });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Calculate detailed statistics
    const solvedProblems = user.checkedProblems.filter((cp) => cp.isSolved);
    const attemptedProblems = user.checkedProblems.filter((cp) => !cp.isSolved);

    // Statistics by difficulty
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

    // Get sprint statistics
    const sprintStats = await SprintProgress.aggregate([
      { $match: { userId: userId } },
      {
        $group: {
          _id: null,
          totalSprintsStarted: { $sum: 1 },
          totalSprintsCompleted: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
          },
          totalProblemsSolvedInSprints: { $sum: { $size: "$problemsSolved" } },
          averageCompletionRate: { $avg: "$progressPercentage" },
        },
      },
    ]);

    // Get recent activity (last 10 solved problems)
    const recentActivity =
      user.problemSolved && user.problemSolved.length > 0
        ? await Problem.find({
            _id: { $in: user.problemSolved.slice(0, 10) },
          }).select("title difficulty tags createdAt")
        : [];

    const profileData = {
      ...user.toObject(),
      statistics: {
        totalProblemsSolved: solvedProblems.length,
        totalProblemsAttempted: attemptedProblems.length,
        successRate:
          attemptedProblems.length > 0
            ? Math.round(
                (solvedProblems.length / attemptedProblems.length) * 100
              )
            : 0,
        points: user.points || 0,
        currentStreak: user.streaks?.current || 0,
        longestStreak: user.streaks?.longest || 0,
        statsByDifficulty: statsByDifficulty || { Easy: 0, Medium: 0, Hard: 0 },
        sprintStats: sprintStats[0] || {
          totalSprintsStarted: 0,
          totalSprintsCompleted: 0,
          totalProblemsSolvedInSprints: 0,
          averageCompletionRate: 0,
        },
      },
      recentActivity: recentActivity || [],
    };

    res.status(200).json(profileData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.result._id;
    const { firstName, lastName, age, profileImageUrl } = req.body;

    // Validate input
    if (firstName && (firstName.length < 3 || firstName.length > 20)) {
      return res
        .status(400)
        .json({ error: "First name must be between 3-20 characters" });
    }

    if (lastName && (lastName.length < 1 || lastName.length > 20)) {
      return res
        .status(400)
        .json({ error: "Last name must be between 1-20 characters" });
    }

    if (age && (age < 6 || age > 80)) {
      return res.status(400).json({ error: "Age must be between 6-80" });
    }

    // Update user profile
    const updateData = {};
    if (firstName) updateData.firstName = firstName.trim();
    if (lastName) updateData.lastName = lastName.trim();
    if (age) updateData.age = age;
    if (profileImageUrl) updateData.profileImageUrl = profileImageUrl.trim();

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select(
      "-password -resetPasswordToken -resetPasswordExpiresAt -verificationToken -verificationTokenExpiresAt"
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const userId = req.result._id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ error: "Current password and new password are required" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ error: "New password must be at least 6 characters long" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await User.findByIdAndUpdate(userId, { password: hashedNewPassword });

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get user's activity history
const getUserActivity = async (req, res) => {
  try {
    const userId = req.result._id;
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get solved problems with details
    const solvedProblems = await Problem.find({
      _id: { $in: user.problemSolved },
    })
      .select("title difficulty tags createdAt")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get sprint activities
    const sprintActivities = await SprintProgress.find({ userId })
      .populate("sprintId", "title category difficulty")
      .sort({ lastActivityAt: -1 })
      .limit(10);

    const activity = {
      solvedProblems: solvedProblems.map((problem) => ({
        _id: problem._id,
        title: problem.title,
        difficulty: problem.difficulty,
        tags: problem.tags,
        solvedAt: user.checkedProblems.find(
          (cp) => cp.pid.toString() === problem._id.toString() && cp.isSolved
        )?.submitDate,
      })),
      sprintActivities: sprintActivities.map((activity) => ({
        sprintId: activity.sprintId._id,
        sprintTitle: activity.sprintId.title,
        sprintCategory: activity.sprintId.category,
        sprintDifficulty: activity.sprintId.difficulty,
        status: activity.status,
        progressPercentage: activity.progressPercentage,
        problemsSolved: activity.problemsSolved.length,
        lastActivityAt: activity.lastActivityAt,
      })),
    };

    res.status(200).json(activity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user's achievements
const getUserAchievements = async (req, res) => {
  try {
    const userId = req.result._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const solvedProblems = user.checkedProblems.filter((cp) => cp.isSolved);

    // Calculate achievements
    const achievements = [];

    // Problem solving achievements
    if (solvedProblems.length >= 1) {
      achievements.push({
        id: "first_problem",
        title: "First Problem Solved",
        description: "Solved your first coding problem!",
        icon: "🎯",
        unlockedAt: new Date(),
        category: "problem_solving",
      });
    }

    if (solvedProblems.length >= 10) {
      achievements.push({
        id: "problem_solver",
        title: "Problem Solver",
        description: "Solved 10 coding problems!",
        icon: "🏆",
        unlockedAt: new Date(),
        category: "problem_solving",
      });
    }

    if (solvedProblems.length >= 50) {
      achievements.push({
        id: "expert_solver",
        title: "Expert Solver",
        description: "Solved 50 coding problems!",
        icon: "💎",
        unlockedAt: new Date(),
        category: "problem_solving",
      });
    }

    // Streak achievements
    if (user.streaks.longest >= 7) {
      achievements.push({
        id: "week_streak",
        title: "Week Warrior",
        description: "Maintained a 7-day coding streak!",
        icon: "🔥",
        unlockedAt: new Date(),
        category: "streak",
      });
    }

    if (user.streaks.longest >= 30) {
      achievements.push({
        id: "month_streak",
        title: "Month Master",
        description: "Maintained a 30-day coding streak!",
        icon: "⚡",
        unlockedAt: new Date(),
        category: "streak",
      });
    }

    // Points achievements
    if (user.points >= 100) {
      achievements.push({
        id: "century_points",
        title: "Century Club",
        description: "Earned 100 points!",
        icon: "💯",
        unlockedAt: new Date(),
        category: "points",
      });
    }

    if (user.points >= 500) {
      achievements.push({
        id: "high_scorer",
        title: "High Scorer",
        description: "Earned 500 points!",
        icon: "🌟",
        unlockedAt: new Date(),
        category: "points",
      });
    }

    // Difficulty achievements
    const easySolved = solvedProblems.filter(
      (cp) => cp.pid && cp.pid.difficulty === "Easy"
    ).length;
    const mediumSolved = solvedProblems.filter(
      (cp) => cp.pid && cp.pid.difficulty === "Medium"
    ).length;
    const hardSolved = solvedProblems.filter(
      (cp) => cp.pid && cp.pid.difficulty === "Hard"
    ).length;

    if (easySolved >= 5) {
      achievements.push({
        id: "easy_master",
        title: "Easy Master",
        description: "Solved 5 easy problems!",
        icon: "🟢",
        unlockedAt: new Date(),
        category: "difficulty",
      });
    }

    if (mediumSolved >= 5) {
      achievements.push({
        id: "medium_master",
        title: "Medium Master",
        description: "Solved 5 medium problems!",
        icon: "🟡",
        unlockedAt: new Date(),
        category: "difficulty",
      });
    }

    if (hardSolved >= 3) {
      achievements.push({
        id: "hard_master",
        title: "Hard Master",
        description: "Solved 3 hard problems!",
        icon: "🔴",
        unlockedAt: new Date(),
        category: "difficulty",
      });
    }

    res.status(200).json({
      achievements,
      totalAchievements: achievements.length,
      categories: {
        problem_solving: achievements.filter(
          (a) => a.category === "problem_solving"
        ).length,
        streak: achievements.filter((a) => a.category === "streak").length,
        points: achievements.filter((a) => a.category === "points").length,
        difficulty: achievements.filter((a) => a.category === "difficulty")
          .length,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get image upload signature
const getImageUploadSignature = async (req, res) => {
  try {
    const userId = req.userId;

    // Generate unique public_id for the image
    const timestamp = Math.round(new Date().getTime() / 1000);
    const publicId = `codeai-profiles/${userId}_${timestamp}`;

    // Upload parameters
    const uploadParams = {
      timestamp: timestamp,
      public_id: publicId,
    };

    // Generate signature
    const signature = cloudinary.utils.api_sign_request(
      uploadParams,
      process.env.CLOUDINARY_API_SECRET
    );

    const reply = {
      signature,
      timestamp,
      public_id: publicId,
      api_key: process.env.CLOUDINARY_API_KEY,
      upload_url: `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
    };

    res.status(200).json(reply);
  } catch (error) {
    console.error("Error generating image upload signature:", error);
    res.status(500).json({ error: "Failed to generate upload credentials" });
  }
};

// Save image metadata after upload
const saveImageMetadata = async (req, res) => {
  try {
    const { cloudinaryPublicId, secureUrl } = req.body;
    const userId = req.userId;

    // Verify the upload with Cloudinary
    const cloudinaryResource = await cloudinary.api.resource(
      cloudinaryPublicId,
      { resource_type: "image" }
    );

    if (!cloudinaryResource) {
      return res.status(400).json({ error: "Image not found on Cloudinary" });
    }

    // Update user profile with image URL
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        profileImageUrl: cloudinaryResource.secureUrl || secureUrl,
        profile_img: cloudinaryResource.secureUrl || secureUrl,
      },
      { new: true }
    ).select(
      "-password -resetPasswordToken -resetPasswordExpiresAt -verificationToken -verificationTokenExpiresAt"
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Profile image updated successfully",
      user: {
        id: updatedUser._id,
        profileImageUrl: updatedUser.profileImageUrl,
        profile_img: updatedUser.profile_img,
      },
    });
  } catch (error) {
    console.error("Error saving image metadata:", error);
    res.status(500).json({ error: "Failed to save image metadata" });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  changePassword,
  getUserActivity,
  getUserAchievements,
  getImageUploadSignature,
  saveImageMetadata,
};
