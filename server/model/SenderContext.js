const mongoose = require("mongoose");

const senderContextSchema = new mongoose.Schema(
  {
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
      unique: true, // ensures 1 context per workspace
      index: true,
    },

    intent: {
      type: String,
      enum: ["pitch", "job", "collaboration"],
      required: true,
    },

    summary: {
      type: String,
      required: true,
      trim: true,
      maxlength: 3000,
    },

    additionalNotes: {
      type: String,
      trim: true,
      maxlength: 3000,
    },
  },
  {
    timestamps: true, // creates createdAt + updatedAt
  }
);

module.exports = mongoose.model("SenderContext", senderContextSchema);
