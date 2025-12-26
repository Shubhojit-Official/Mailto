const mongoose = require("mongoose");

const workspaceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 60,
    },

    color: {
      type: String,
      enum: ["blue", "green", "purple", "orange", "pink", "teal"],
      required: true,
      default: "blue",
    },
  },
  {
    timestamps: true, // adds createdAt + updatedAt fields
  }
);

module.exports = mongoose.model("Workspace", workspaceSchema);
