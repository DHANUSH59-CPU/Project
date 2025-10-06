const mongoose = require("mongoose");
const { Schema } = mongoose;

const sprintProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    sprintId: {
      type: Schema.Types.ObjectId,
      ref: "sprint",
      required: true,
    },
    status: {
      type: String,
      enum: ["not_started", "in_progress", "completed", "abandoned"],
      default: "not_started",
    },
    startedAt: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    problemsSolved: [
      {
        problemId: {
          type: Schema.Types.ObjectId,
          ref: "problem",
          required: true,
        },
        solvedAt: {
          type: Date,
          default: Date.now,
        },
        attempts: {
          type: Number,
          default: 1,
          min: 1,
        },
        timeSpent: {
          type: Number, // in minutes
          default: 0,
        },
      },
    ],
    totalTimeSpent: {
      type: Number, // in minutes
      default: 0,
    },
    currentStreak: {
      type: Number,
      default: 0,
    },
    longestStreak: {
      type: Number,
      default: 0,
    },
    lastActivityAt: {
      type: Date,
      default: Date.now,
    },
    progressPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    rewardsEarned: [
      {
        type: {
          type: String,
          enum: ["points", "badge", "certificate"],
          required: true,
        },
        value: Number,
        badgeName: String,
        earnedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for problems solved count
sprintProgressSchema.virtual("problemsSolvedCount").get(function () {
  return this.problemsSolved.length;
});

// Virtual for completion status
sprintProgressSchema.virtual("isCompleted").get(function () {
  return this.status === "completed";
});

// Virtual for time remaining (if sprint has time limit)
sprintProgressSchema.virtual("timeRemaining").get(function () {
  if (this.startedAt && this.sprintId?.estimatedTime) {
    const elapsed = Date.now() - this.startedAt.getTime();
    const remaining = this.sprintId.estimatedTime * 60 * 1000 - elapsed;
    return Math.max(0, remaining);
  }
  return null;
});

// Compound index for efficient queries
sprintProgressSchema.index({ userId: 1, sprintId: 1 }, { unique: true });
sprintProgressSchema.index({ userId: 1, status: 1 });
sprintProgressSchema.index({ sprintId: 1, status: 1 });
sprintProgressSchema.index({ lastActivityAt: -1 });

const SprintProgress = mongoose.model("sprintProgress", sprintProgressSchema);
module.exports = SprintProgress;
