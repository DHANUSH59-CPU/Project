const mongoose = require("mongoose");
const { Schema } = mongoose;

const likeSchema = new Schema({
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index to ensure one like per user per problem
likeSchema.index({ user: 1, problem: 1 }, { unique: true });

const Like = mongoose.model("like", likeSchema);
module.exports = Like;
