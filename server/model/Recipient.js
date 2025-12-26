const mongoose = require("mongoose");

const recipientSchema = new mongoose.Schema(
  {
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
      index: true,
    },

    xHandle: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    name: {
      type: String,
      trim: true,
    },

    profileSnapshot: {
      type: String,
      trim: true,
      maxlength: 5000, // full scraped profile text
    },
  },
  {
    timestamps: true, // createdAt + updatedAt
  }
);

module.exports = mongoose.model("Recipient", recipientSchema);
