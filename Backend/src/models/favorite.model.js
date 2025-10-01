const mongoose = require("mongoose");
const { Schema } = mongoose;

const favoriteSchema = new Schema({
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

// Compound index to ensure one favorite per user per problem
favoriteSchema.index({ user: 1, problem: 1 }, { unique: true });

const Favorite = mongoose.model("favorite", favoriteSchema);
module.exports = Favorite;
