const mongoose = require("mongoose");
const { Schema } = mongoose;

const connectionRequestSchema = new Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "ignored", "interested", "accepted", "rejected"],
        message: `{VALUE} is incorrect status type`,
      },
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Creating compound index for efficient queries and uniqueness
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true });

// Index for fetching received requests
connectionRequestSchema.index({ toUserId: 1, status: 1 });

// Pre-save middleware to prevent self-connections
connectionRequestSchema.pre("save", function (next) {
  // Check if fromUserId is same as toUserId
  if (this.fromUserId.equals(this.toUserId)) {
    throw new Error("You cannot send request to yourself");
  }
  next();
});

const ConnectionRequest = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionRequest;
