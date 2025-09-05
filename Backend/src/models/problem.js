const mongoose = require("mongoose");
const { Schema } = mongoose;

const problemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    problemNo: {
      type: Number,
      required: true,
      min: 1,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ["Basic", "Easy", "Medium", "Hard"],
      required: true,
      trim: true,
    },
    tags: {
      type: [
        {
          type: String,
          enum: [
            "strings",
            "arrays",
            "linked-list",
            "stacks",
            "queues",
            "hash-maps",
            "sorting",
            "searching",
            "binary-search",
            "graphs",
            "trees",
            "dynamic-programming",
            "backtracking",
            "greedy",
            "heap",
            "bit-manipulation",
            "mathematical",
            "two-pointers",
            "sliding-window",
            "recursion",
            "design",
            "math",
            "prefix-sum",
            "other",
          ],
          required: true,
          trim: true,
        },
      ],
      required: true,
      trim: true,
    },
    acceptance: {
      type: Number,
      default: null,
    },
    constraints: {
      // The type of constraints is array
      // Each element in the array must be a string.
      type: [
        {
          type: String,
          trim: true,
        },
      ],
      required: true,
    },
    starterCode: [
      // Nice 👌 you’re building a schema where starterCode is an array of objects, each object describing a code snippet in a particular language.
      {
        language: {
          type: String,
          enum: ["c", "cpp", "java", "python", "javascirpt"],
          required: true,
          trim: true,
        },
        headerCode: {
          type: String,
          trim: true,
        },
        code: {
          type: String,
          required: true,
          trim: true,
        },
        mainCode: {
          type: String,
          trim: true,
        },
      },
    ],
    examples: [
      {
        input: {
          type: String,
          required: true,
          trim: true,
        },
        output: {
          type: String,
          trim: true,
        },
        explanation: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],
    hiddenTestCases: [
      {
        input: {
          type: String,
          required: true,
          trim: true,
        },
        output: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],
    referenceSolution: [
      {
        language: {
          type: String,
          enum: ["c", "cpp", "java", "python", "javascript"],
          required: true,
          trim: true,
        },
        solutionCode: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],
    problemCreator: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    likes: {
      type: Number,
      min: 0,
      default: 0,
    },
    companies: {
      type: [String],
    },
    hints: {
      type: [String],
    },
    comments: {
      type: [comments],
    },
  },
  {
    timestamps: true,
  }
);

const Problem = mongoose.model("problems", problemSchema);

module.exports = Problem;
