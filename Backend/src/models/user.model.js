/**
 * AlgoMaster User Model
 * Defines user schema for the competitive programming platform
 */

const mongoose = require("mongoose");
const { Schema } = mongoose;
const userScheme = new mongoose.Schema(
  {
    firstName: {
      type: String,
      require: true,
      minLength: 3,
      maxLength: 20,
      trim: true,
    },
    lastName: {
      type: String,
      maxLength: 20,
      trim: true,
    },
    profile_img: {
      type: String,
      trim: true,
    },
    profileImageUrl: {
      type: String,
      trim: true,
    },
    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    emailId: {
      type: String,
      require: true,
      unique: true,
      trim: true,
      lowercase: true,
      immutable: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    age: {
      type: Number,
      min: 6,
      max: 80,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    problemSolved: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "problem",
        },
      ],
      default: [],
    },
    // Leaderboard fields
    points: {
      type: Number,
      min: 0,
      default: 0,
      required: true,
    },
    streaks: {
      current: {
        type: Number,
        default: 1,
        min: 0,
      },
      longest: {
        type: Number,
        default: 1,
        min: 0,
      },
      lastUpdated: {
        type: Date,
        default: Date.now,
      },
    },
    checkedProblems: {
      type: [
        {
          pid: {
            type: Schema.Types.ObjectId,
            ref: "problem",
          },
          isSolved: {
            type: Boolean,
          },
          submitDate: {
            type: Date,
          },
        },
      ],
      default: [],
    },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
  },

  { timestamps: true }
);

const User = mongoose.model("user", userScheme);
module.exports = User;
