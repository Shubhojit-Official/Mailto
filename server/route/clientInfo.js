const express = require("express");
const axios = require("axios");
const Recipient = require("../model/Recipient");
const Workspace = require("../model/Workspace");
const userMiddleware = require("../middleware/userMiddleware");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const router = express.Router();

// CREATE RECIPIENT AND X POSTS ANALYSIS
router.post("/", userMiddleware, async (req, res) => {
  try {
    const { xHandle, email, workspaceId } = req.body;

    if (!xHandle || !workspaceId) {
      return res.status(400).json({
        message: "xHandle and workspaceId required",
      });
    }

    // workspace verification
    const workspace = await Workspace.findOne({
      _id: workspaceId,
      userId: req.userId,
    });

    if (!workspace) {
      return res.status(403).json({
        message: "Unauthorized workspace",
      });
    }

    // Fetch uid
    const userRes = await axios.get("https://twitter241.p.rapidapi.com/user", {
      params: { username: xHandle },
      headers: {
        "X-RapidAPI-Key": process.env.RAPID_API_KEY,
        "X-RapidAPI-Host": "twitter241.p.rapidapi.com",
      },
    });

    const twitterId =
      userRes.data?.result?.data?.user?.result?.rest_id;

    let name =
      userRes.data?.result?.data?.user?.result?.legacy?.name || "";

    // Fetch tweets
    let tweets = [];
    try {
      const tweetsRes = await axios.get(
        "https://twitter241.p.rapidapi.com/user-tweets",
        {
          params: { user: twitterId, count: "12" },
          headers: {
            "X-RapidAPI-Key": process.env.RAPID_API_KEY,
            "X-RapidAPI-Host": "twitter241.p.rapidapi.com",
          },
        }
      );

      const instructions =
        tweetsRes.data?.result?.timeline?.instructions || [];

      const entryBlock = instructions.find(
        (i) => i.type === "TimelineAddEntries"
      );

      tweets =
        entryBlock?.entries
          ?.map((e) => e.content?.itemContent?.tweet_results?.result?.legacy?.full_text)
          ?.filter(Boolean)
          ?.slice(0, 12) || [];
    } catch (err) {
      console.log("Tweet fetch failed: continuing without summary");
    }

    let profileSnapshot = null;

    if (tweets.length > 0) {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

      const prompt = `
      You are expert in personality analysis from tweets
      Analyze the personality behind these tweets and write a short 3-5 sentence insight:
      Tweets:
      """
      ${tweets.join("\n\n")}
      """
      Be professional, avoid bullet points.
      `;

      const result = await model.generateContent(prompt);
      profileSnapshot = result.response.text()?.trim() || null;
    }

    const recipient = await Recipient.create({
      workspaceId,
      xHandle: xHandle.toLowerCase().trim(),
      email: email?.toLowerCase()?.trim() || null,
      name,
      profileSnapshot,
    });

    return res.json({
      message: "Recipient saved successfully",
      recipient,
    });

  } catch (err) {
    console.error("Recipient API Error:", err);
    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
});



// GET ALL RECIPIENTS FOR WORKSPACE
router.get("/:workspaceId", userMiddleware, async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const workspace = await Workspace.findOne({
      _id: workspaceId,
      userId: req.userId,
    });

    if (!workspace)
      return res.status(403).json({ message: "Unauthorized workspace" });

    const recipients = await Recipient.find({ workspaceId }).sort({
      createdAt: -1,
    });

    return res.json(recipients);
  } catch (err) {
    console.error("Fetch Recipients Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


// DELETE RECIPIENT
router.delete("/:id", userMiddleware, async (req, res) => {
  try {
    const recipient = await Recipient.findById(req.params.id).populate("workspaceId");

    if (!recipient)
      return res.status(404).json({ message: "Recipient not found" });

    if (recipient.workspaceId.userId.toString() !== req.userId)
      return res.status(403).json({ message: "Unauthorized" });

    await recipient.deleteOne();

    res.json({ message: "Recipient deleted" });
  } catch (err) {
    console.error("Delete Error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
