const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema({
  leadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lead",
    required: true,
  },

  subject: String,
  body: String,

  // Tone sliders used
  personalization: Number,
  formality: Number,
  persuasiveness: Number,

  // Tracking
  sent: { type: Boolean, default: false },
  sentAt: Date,
  opened: { type: Boolean, default: false },
  openedAt: Date,
  replied: { type: Boolean, default: false },
  repliedAt: Date,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Email", emailSchema);
