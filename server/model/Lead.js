const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  personalitySummary: {
    type: String,
    required: false,
  },

  lastEmailContent: {
    type: String,
    required: false,
  },

  emailSent: {
    type: Boolean,
    default: false,
  },
  emailOpened: {
    type: Boolean,
    default: false,
  },
  emailReplied: {
    type: Boolean,
    default: false,
  },

  sentAt: Date,
  openedAt: Date,
  repliedAt: Date,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Lead = mongoose.model("Lead", leadSchema);
module.exports = Lead;
