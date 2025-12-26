const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema(
  {
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
      index: true,
    },

    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipient",
      required: true,
    },

    subject: {
      type: String,
      trim: true,
      maxlength: 200,
    },

    body: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["draft", "sent", "opened", "replied", "failed"],
      default: "draft",
      index: true,
    },

    sentAt: Date,
    openedAt: Date,
    repliedAt: Date,

    personalization: { type: Number, min: 0, max: 100 },
    formality: { type: Number, min: 0, max: 100 },
    persuasiveness: { type: Number, min: 0, max: 100 },
  },
  {
    timestamps: true, // createdAt + updatedAt
  }
);

module.exports = mongoose.model("Email", emailSchema);
