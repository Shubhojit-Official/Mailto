const mongoose = require("mongoose");

const contextSchema = new mongoose.Schema({
  workspaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Workspace",
    required: true,
  },

  mode: {
    type: String,
    enum: ["pitch", "job", "collaboration"],
    required: true,
  },

  // Universal fields
  coreValue: String,
  proof: String,

  // Pitch fields
  whatSelling: String,
  targetAudience: String,

  // Job outreach fields
  roleSeeking: String,
  skills: String,
  experience: String,
  whyYou: String,

  // Collaboration fields
  collabIdea: String,
  whyThem: String,
  whatYouProvide: String,

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Context", contextSchema);