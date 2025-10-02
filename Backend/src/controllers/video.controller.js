const cloudinary = require("../config/cloudinary");
const Problem = require("../models/problem");
const SolutionVideo = require("../models/solutionVideo");
const mongoose = require("mongoose");

// Get video upload signature
const getVideoSignature = async (req, res) => {
  try {
    const { problemId } = req.params;
    const userId = req.userId;

    // verify if given problem id has a valid type
    if (!mongoose.Types.ObjectId.isValid(problemId))
      return res.status(400).send({ error: "Invalid Problem ID provided." });

    // Verify problem exists
    const problem = await Problem.findById(problemId);
    if (!problem) return res.status(404).json({ error: "Problem not found" });

    // Check if video already exists for this problem
    const existingVideo = await SolutionVideo.findOne({
      problem: problemId,
    });

    if (existingVideo) {
      return res.status(409).json({
        error: "Video Solution for the given problem already exists.",
      });
    }

    // Generate unique public_id for the video
    const timestamp = Math.round(new Date().getTime() / 1000);
    const publicId = `codeai-solutions/${problemId}/${userId}_${timestamp}`;

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
      upload_url: `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/video/upload`,
    };

    res.status(200).json(reply);
  } catch (error) {
    console.error("Error generating upload signature:", error);
    res.status(500).json({ error: "Failed to generate upload credentials" });
  }
};

// Save video metadata after upload
const saveVideoMetaData = async (req, res) => {
  try {
    const { cloudinaryPublicId, secureUrl, duration } = req.body;
    const { problemId } = req.params;
    const userId = req.userId;

    // verify if given problem id has a valid type
    if (!mongoose.Types.ObjectId.isValid(problemId))
      return res.status(400).send({ error: "Invalid Problem ID provided." });

    // Verify the upload with Cloudinary
    const cloudinaryResource = await cloudinary.api.resource(
      cloudinaryPublicId,
      { resource_type: "video" }
    );

    if (!cloudinaryResource) {
      return res.status(400).json({ error: "Video not found on Cloudinary" });
    }

    // Check if video already exists for this problem
    const existingVideo = await SolutionVideo.findOne({
      problem: problemId,
    });

    if (existingVideo) {
      return res.status(409).json({
        error: "Video Solution for the given problem already exists.",
      });
    }

    const thumbnailUrl = cloudinary.url(cloudinaryResource.public_id, {
      resource_type: "image",
      transformation: [
        { width: 400, height: 225, crop: "fill" },
        { quality: "auto" },
        { start_offset: "auto" },
      ],
      format: "jpg",
    });

    // Create video solution record
    const videoSolution = await SolutionVideo.create({
      problem: problemId,
      user: userId,
      cloudinaryPublicId,
      secureUrl: cloudinaryResource.secureUrl || secureUrl,
      duration: cloudinaryResource.duration || duration,
      thumbnailUrl,
    });

    res.status(201).json({
      message: "Video solution saved successfully",
      videoSolution: {
        id: videoSolution._id,
        thumbnailUrl: videoSolution.thumbnailUrl,
        duration: videoSolution.duration,
        secureUrl: videoSolution.secureUrl,
        cloudinaryPublicId: videoSolution.cloudinaryPublicId,
        uploadedAt: videoSolution.createdAt,
      },
    });
  } catch (error) {
    console.error("Error saving video metadata:", error);
    res.status(500).json({ error: "Failed to save video metadata" });
  }
};

// Get video solution for a problem
const getVideoSolution = async (req, res) => {
  try {
    const { problemId } = req.params;

    // verify if given problem id has a valid type
    if (!mongoose.Types.ObjectId.isValid(problemId))
      return res.status(400).send({ error: "Invalid Problem ID provided." });

    const video = await SolutionVideo.findOne({ problem: problemId })
      .populate("user", "username email")
      .populate("problem", "title difficulty");

    if (!video) {
      return res.status(404).json({ error: "Video solution not found" });
    }

    res.status(200).json({
      success: true,
      videoSolution: {
        id: video._id,
        thumbnailUrl: video.thumbnailUrl,
        duration: video.duration,
        secureUrl: video.secureUrl,
        cloudinaryPublicId: video.cloudinaryPublicId,
        uploadedAt: video.createdAt,
        uploadedBy: {
          username: video.user.username,
          email: video.user.email,
        },
        problem: {
          title: video.problem.title,
          difficulty: video.problem.difficulty,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching video solution:", error);
    res.status(500).json({ error: "Failed to fetch video solution" });
  }
};

// Delete video solution
const deleteVideoSolution = async (req, res) => {
  try {
    const { problemId } = req.params;
    const userId = req.userId;
    const userRole = req.userRole;

    // verify if given problem id has a valid type
    if (!mongoose.Types.ObjectId.isValid(problemId))
      return res.status(400).send({ error: "Invalid Problem ID provided." });

    // Find the video first to check ownership
    const video = await SolutionVideo.findOne({ problem: problemId });

    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    // Check if user is admin or the uploader
    const isAdmin = userRole === "admin";
    const isUploader = video.user.toString() === userId;

    if (!isAdmin && !isUploader) {
      return res.status(403).json({
        error:
          "Unauthorized - Only admins or video uploaders can delete videos",
      });
    }

    // Delete from database
    await SolutionVideo.findByIdAndDelete(video._id);

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(video.cloudinaryPublicId, {
      resource_type: "video",
      invalidate: true,
    });

    res.status(200).json({
      success: true,
      message: "Video solution deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting video:", error);
    res.status(500).json({ error: "Failed to delete video" });
  }
};

module.exports = {
  getVideoSignature,
  saveVideoMetaData,
  getVideoSolution,
  deleteVideoSolution,
};
