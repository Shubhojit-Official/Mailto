const express = require("express");
const SenderContext = require("../model/SenderContext");
const Workspace = require("../model/Workspace");
const userMiddleware = require("../middleware/userMiddleware");
const { generateContextSummary } = require("../services/geminiService");

const router = express.Router();

// CREATE OR UPDATE CONTEXT
router.post("/", userMiddleware, async (req, res) => {
  try {
    const { workspaceId, intent, additionalNotes, ...intentData } = req.body;

    if (!workspaceId || !intent) {
      return res.status(400).json({
        message: "workspaceId and intent are required",
      });
    }

    if (!["pitch", "job", "collaboration"].includes(intent)) {
      return res.status(400).json({
        message: "Invalid intent type",
      });
    }

    const workspace = await Workspace.findOne({
      _id: workspaceId,
      userId: req.userId,
    });

    if (!workspace) {
      return res.status(403).json({ message: "Unauthorized workspace" });
    }

    const summary = await generateContextSummary(intent, intentData);

    const savedContext = await SenderContext.findOneAndUpdate(
      { workspaceId },
      {
        intent,
        data: intentData,
        userId: req.userId,
        summary,
        additionalNotes: additionalNotes || "",
      },
      { new: true, upsert: true }
    );

    res.json({
      message: "Context saved",
      senderContext: savedContext,
    });
  } catch (err) {
    console.error("Context Save Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/:workspaceId", userMiddleware, async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const context = await SenderContext.findOne({
      workspaceId,
      userId: req.userId,
    }).lean();

    if (!context) {
      return res.status(404).json(null);
    }

    console.log(context.data);

    res.json({
      intent: context.intent,
      data: context.data, // 👈 raw structured data
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch context" });
  }
});

module.exports = router;
