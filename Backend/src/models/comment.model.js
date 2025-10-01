const mongoose = require("mongoose");
const { Schema } = mongoose;

const commentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    problem: {
      type: Schema.Types.ObjectId,
      ref: "problem",
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxLength: 1000,
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
    editedAt: {
      type: Date,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    replies: [
      {
        type: Schema.Types.ObjectId,
        ref: "comment",
      },
    ],
    parentComment: {
      type: Schema.Types.ObjectId,
      ref: "comment",
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
commentSchema.index({ problem: 1, createdAt: -1 });
commentSchema.index({ user: 1, createdAt: -1 });

const Comment = mongoose.model("comment", commentSchema);
module.exports = Comment;
