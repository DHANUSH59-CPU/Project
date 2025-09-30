const Sprint = require("../models/sprint.model");
const Problem = require("../models/problem");

// Create a new sprint
const createSprint = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      difficulty,
      problems,
      estimatedTime,
      points,
      tags,
      prerequisites,
      learningObjectives,
      completionReward,
    } = req.body;

    // Validate required fields
    if (
      !title ||
      !description ||
      !category ||
      !difficulty ||
      !problems ||
      !estimatedTime
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Validate problems exist
    const existingProblems = await Problem.find({ _id: { $in: problems } });
    if (existingProblems.length !== problems.length) {
      return res.status(400).json({ error: "Some problems not found" });
    }

    const sprint = new Sprint({
      title,
      description,
      category,
      difficulty,
      problems,
      estimatedTime,
      points: points || 50, // Default points
      tags: tags || [],
      prerequisites: prerequisites || [],
      learningObjectives: learningObjectives || [],
      completionReward: completionReward || {
        type: "points",
        value: points || 50,
      },
      createdBy: req.result._id,
    });

    await sprint.save();

    res.status(201).json({
      message: "Sprint created successfully",
      sprint: sprint,
    });
  } catch (error) {
    console.error("Create sprint error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get all sprints (admin view)
const getAllSprintsAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 10, status = "all" } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (status !== "all") {
      query.isActive = status === "active";
    }

    const sprints = await Sprint.find(query)
      .populate("problems", "title difficulty")
      .populate("createdBy", "firstName lastName")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalSprints = await Sprint.countDocuments(query);

    res.status(200).json({
      sprints,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalSprints / limit),
        totalSprints,
        hasNext: skip + sprints.length < totalSprints,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Get all sprints admin error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update sprint
const updateSprint = async (req, res) => {
  try {
    const { sprintId } = req.params;
    const updateData = req.body;

    const sprint = await Sprint.findByIdAndUpdate(sprintId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!sprint) {
      return res.status(404).json({ error: "Sprint not found" });
    }

    res.status(200).json({
      message: "Sprint updated successfully",
      sprint,
    });
  } catch (error) {
    console.error("Update sprint error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete sprint
const deleteSprint = async (req, res) => {
  try {
    const { sprintId } = req.params;

    const sprint = await Sprint.findByIdAndDelete(sprintId);

    if (!sprint) {
      return res.status(404).json({ error: "Sprint not found" });
    }

    res.status(200).json({
      message: "Sprint deleted successfully",
    });
  } catch (error) {
    console.error("Delete sprint error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Toggle sprint active status
const toggleSprintStatus = async (req, res) => {
  try {
    const { sprintId } = req.params;

    const sprint = await Sprint.findById(sprintId);
    if (!sprint) {
      return res.status(404).json({ error: "Sprint not found" });
    }

    sprint.isActive = !sprint.isActive;
    await sprint.save();

    res.status(200).json({
      message: `Sprint ${
        sprint.isActive ? "activated" : "deactivated"
      } successfully`,
      sprint,
    });
  } catch (error) {
    console.error("Toggle sprint status error:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createSprint,
  getAllSprintsAdmin,
  updateSprint,
  deleteSprint,
  toggleSprintStatus,
};
