const express = require("express");
const Workspace = require("../model/Workspace");
const Recipient = require("../model/Recipient");
const SenderContext = require("../model/SenderContext");
const Email = require("../model/Email");
const userMiddleware = require("../middleware/userMiddleware");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const router = express.Router();

/* ===================== GENERATE EMAIL ===================== */
router.post("/generate", userMiddleware, async (req, res) => {
  try {
    const {
      recipientId,
      workspaceId,
      personalization,
      formality,
      persuasiveness,
    } = req.body;

    if (!recipientId || !workspaceId) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const workspace = await Workspace.findOne({
      _id: workspaceId,
      userId: req.userId,
    });
    if (!workspace) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const recipient = await Recipient.findById(recipientId);
    const senderContext = await SenderContext.findOne({ workspaceId });

    if (!recipient || !senderContext) {
      return res.status(404).json({ message: "Missing data" });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
    });

    const prompt = `
Subject: <one concise subject line>

Write a personalized outreach email.

Sender context:
"${senderContext.summary}"

Recipient profile:
"${recipient.profileSnapshot || "No profile info"}"

Tone:
- Personalization: ${personalization}/100
- Formality: ${formality}/100
- Persuasiveness: ${persuasiveness}/100

Rules:
- Professional
- 3–5 short paragraphs
- No markdown
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const [firstLine, ...rest] = text.split("\n");

    res.json({
      subject: firstLine.replace(/^Subject:/i, "").trim(),
      body: rest.join("\n").trim(),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to generate email" });
  }
});

/* ===================== SAVE DRAFT ===================== */
router.post("/draft", userMiddleware, async (req, res) => {
  try {
    const { recipientId, workspaceId, subject, body } = req.body;

    if (!recipientId || !workspaceId || !subject || !body) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const workspace = await Workspace.findOne({
      _id: workspaceId,
      userId: req.userId,
    });
    if (!workspace) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    let email = await Email.findOne({ recipientId, workspaceId });

    if (!email) {
      email = await Email.create({
        recipientId,
        workspaceId,
        subject,
        body,
        status: "draft",
      });
    } else {
      email.subject = subject;
      email.body = body;
      email.status = "draft";
      await email.save();
    }

    res.json({ email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save draft" });
  }
});

module.exports = router;
