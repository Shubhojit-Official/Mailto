const axios = require("axios");
const { Router } = require("express");
const clientInfoRouter = Router();
const userMiddleware = require("../middleware/userMiddleware");
const Lead = require("../model/Lead");
const Workspace = require("../model/Workspace");
const { GoogleGenerativeAI } = require("@google/generative-ai");

clientInfoRouter.post("/fetch-info", userMiddleware, async (req, res) => {
  try {
    const { username, email, workspaceId } = req.body;

    if (!username || !email || !workspaceId) {
      return res.status(400).json({
        message: "username, email & workspaceId required",
        code: 400,
      });
    }

    const userId = req.userId;
    console.log("Logged user:", userId);

    // worksapce verification
    const workspace = await Workspace.findOne({
      _id: workspaceId,
      userId
    });

    if (!workspace) {
      return res.status(403).json({
        message: "Workspace not found / Unauthorized",
        code: 403,
      });
    }

    // x user id
    const userRes = await axios.get("https://twitter241.p.rapidapi.com/user", {
      params: { username },
      headers: {
        "X-RapidAPI-Key": process.env.RAPID_API_KEY,
        "X-RapidAPI-Host": "twitter241.p.rapidapi.com",
      },
    });

    const twitterId =
      userRes.data?.result?.data?.user?.result?.rest_id;

    if (!twitterId) {
      return res.status(500).json({
        message: "Failed to extract Twitter user ID",
        code: 500,
      });
    }

    // fetch tweets
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

    const addEntries = instructions.find(
      (i) => i.type === "TimelineAddEntries"
    );

    const tweets =
      addEntries?.entries
        ?.filter((e) => e.content?.itemContent?.itemType === "TimelineTweet")
        .map(
          (e) =>
            e.content.itemContent.tweet_results.result.legacy?.full_text
        )
        .slice(0, 12);

    if (!tweets?.length) {
      return res.status(404).json({
        message: "No tweets found to analyze",
        code: 404,
      });
    }

    // gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    const prompt = `
    Analyze the following tweets and write a 4-6 sentence personality summary.
    No bullet points or JSON.

    Tweets:
    """
    ${tweets.join("\n")}
    """
    `;

    const result = await model.generateContent(prompt);
    const personalitySummary = result.response.text()?.trim();

    // save
    const lead = await Lead.create({
      userId,
      workspaceId,
      email,
      personalitySummary,
    });

    return res.status(200).json({
      message: "Lead saved successfully",
      lead,
      code: 200,
    });

  } catch (err) {
    console.error("Error in /fetch-info:", err);
    return res.status(500).json({
      message: "Something went wrong",
      error: err.response?.data || err.message,
      code: 500,
    });
  }
});

module.exports = clientInfoRouter;
