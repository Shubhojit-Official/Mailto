const contextModel = require("../model/SenderContext");
const Workspace = require("../model/Workspace");
const userMiddleware = require("../middleware/userMiddleware");

const Router = require("express");
const contextRouter = Router()

contextRouter.post("/save", userMiddleware, async (req, res) => {
  try {
    const { workspaceId, mode } = req.body; // save the workspace id in fe at the time of creation

    if (!workspaceId || !mode) {
      return res.status(400).json({
        message: "workspaceId and mode are required",
        code: 400,
      });
    }

    // Validate mode
    if (!["pitch", "job", "collaboration"].includes(mode)) {
      return res.status(400).json({
        message: "Invalid context mode",
        code: 400,
      });
    }

    // Make sure workspace belongs to this user
    const workspace = await Workspace.findOne({
      _id: workspaceId,
      userId: req.userId,
    });

    if (!workspace) {
      return res.status(403).json({
        message: "Unauthorized: Workspace not found",
        code: 403,
      });
    }

    // Context data fields
    const contextData = {
      mode,
      updatedAt: Date.now(),
    };

    if (mode === "pitch") {
      const { whatSelling, targetAudience, coreValue, proof } = req.body;
      contextData.whatSelling = whatSelling;
      contextData.targetAudience = targetAudience;
      contextData.coreValue = coreValue;
      contextData.proof = proof;
    }

    if (mode === "job") {
      const { roleSeeking, skills, experience, whyYou } = req.body;
      contextData.roleSeeking = roleSeeking;
      contextData.skills = skills;
      contextData.experience = experience;
      contextData.whyYou = whyYou;
    }

    if (mode === "collaboration") {
      const { collabIdea, whyThem, whatYouProvide } = req.body;
      contextData.collabIdea = collabIdea;
      contextData.whyThem = whyThem;
      contextData.whatYouProvide = whatYouProvide;
    }

    // new or update
    const savedContext = await contextModel.findOneAndUpdate(
      { workspaceId },
      { $set: contextData },
      { new: true, upsert: true }
    );

    return res.status(200).json({
      message: "Context saved successfully",
      context: savedContext,
      code: 200,
    });

  } catch (err) {
    console.error("Context Save Error:", err);
    return res.status(500).json({
      message: "Server error",
      error: err.message,
      code: 500,
    });
  }
});

module.exports = contextRouter;
