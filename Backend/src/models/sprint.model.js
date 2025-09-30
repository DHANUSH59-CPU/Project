const mongoose = require("mongoose");
const { Schema } = mongoose;

const sprintSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxLength: 100,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxLength: 500,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Arrays",
        "Strings",
        "Dynamic Programming",
        "Graphs",
        "Trees",
        "Sorting",
        "Searching",
        "Greedy",
        "Backtracking",
        "Math",
        "Bit Manipulation",
        "Two Pointers",
        "Sliding Window",
        "Stack",
        "Queue",
        "Hash Table",
        "Linked List",
        "Binary Search",
        "Recursion",
        "Other",
      ],
      default: "Other",
    },
    difficulty: {
      type: String,
      required: true,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    problems: [
      {
        type: Schema.Types.ObjectId,
        ref: "problem",
        required: true,
      },
    ],
    estimatedTime: {
      type: Number, // in minutes
      required: true,
      min: 5,
      max: 480, // 8 hours max
    },
    points: {
      type: Number,
      required: true,
      min: 10,
      max: 1000,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    tags: [
      {
        type: String,
        trim: true,
        maxLength: 20,
      },
    ],
    prerequisites: [
      {
        type: String,
        trim: true,
      },
    ],
    learningObjectives: [
      {
        type: String,
        trim: true,
        maxLength: 100,
      },
    ],
    completionReward: {
      type: {
        type: String,
        enum: ["points", "badge", "certificate"],
        default: "points",
      },
      value: {
        type: Number,
        default: 0,
      },
      badgeName: {
        type: String,
        trim: true,
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for problem count
sprintSchema.virtual("problemCount").get(function () {
  return this.problems.length;
});

// Virtual for completion rate (will be calculated in controller)
sprintSchema.virtual("completionRate").get(function () {
  return 0; // Will be calculated based on user progress
});

// Index for better query performance
sprintSchema.index({ category: 1, difficulty: 1, isActive: 1 });
sprintSchema.index({ createdBy: 1 });
sprintSchema.index({ tags: 1 });

const Sprint = mongoose.model("sprint", sprintSchema);
module.exports = Sprint;
