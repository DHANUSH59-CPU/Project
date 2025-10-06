const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const submissionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    problemId: {
      type: Schema.Types.ObjectId,
      ref: "problem",
      require: true,
    },
    code: {
      type: String,
      require: true,
    },
    language: {
      type: String,
      require: true,
      enum: ["javascript", "c++", "java"],
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "wrong", "error"],
      default: "pending",
    },
    runtime: {
      type: Number, // milliseconds
      default: 0,
    },
    memory: {
      type: Number, // kB
      default: 0,
    },
    errorMessage: {
      type: String,
      default: "",
    },
    testCasesPassed: {
      type: Number,
      default: 0,
    },
    testCasesTotal: {
      // Recommended addition
      type: Number,
      default: 0,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

submissionSchema.index({ userId: 1, problemId: 1 });

const submission = mongoose.model("submission", submissionSchema);
module.exports = submission;
