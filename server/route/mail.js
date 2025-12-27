const express = require("express");
const Recipient = require("../model/Recipient");
const SenderContext = require("../model/SenderContext");
const Workspace = require("../model/Workspace");
const Email = require("../model/Email");
const userMiddleware = require("../middleware/userMiddleware");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const nodemailer = require("nodemailer");

const router = express.Router();

const weave = require('weave');

// Define the traced operation outside the route
const generateEmailWithAI = weave.op(async ({ context, recipient, settings }) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

  const prompt = `
    Write a personalized cold email.
    Sender Summary: "${context}"
    Recipient Profile Insight: "${recipient}"
    Tone Settings:
    - Personalization: ${settings.personalization}/100
    - Formality: ${settings.formality}/100
    - Persuasiveness: ${settings.persuasiveness}/100
    Instructions:
    - Include a subject line
    - 3-5 paragraph email
  `;

  const aiResponse = await model.generateContent(prompt);
  const text = aiResponse.response.text().trim();

  const [subjectLine, ...bodyArr] = text.split("\n");

  return {
    subject: subjectLine.replace("Subject:", "").trim(),
    body: bodyArr.join("\n").trim(),
    rawResponse: text
  };
});

// GENERATE EMAIL ROUTE
router.post("/generate", userMiddleware, async (req, res) => {
  try {
    const { recipientId, workspaceId, personalization, formality, persuasiveness } = req.body;

    // ... (Your existing validation and DB lookups) ...
    const recipient = await Recipient.findById(recipientId);
    const context = await SenderContext.findOne({ workspaceId });

    // Calling the Weave Op
    const aiResult = await generateEmailWithAI({
      context: context.summary,
      recipient: recipient.profileSnapshot || "No profile data",
      settings: { personalization, formality, persuasiveness }
    });

    const draftEmail = await Email.create({
      workspaceId,
      recipientId,
      subject: aiResult.subject,
      body: aiResult.body,
      personalization,
      formality,
      persuasiveness,
    });

    return res.json({ message: "Draft email generated", email: draftEmail });

  } catch (err) {
    console.error("EMAIL GENERATE ERROR", err.message);
    res.status(500).json({ message: "AI failed", error: err.message });
  }
});

// SEND MAIL
router.patch("/send/:id", userMiddleware, async (req, res) => {
  try {
    const emailDoc = await Email.findById(req.params.id)
      .populate("workspaceId")
      .populate("recipientId");

    if (!emailDoc) return res.status(404).json({ message: "Email not found" });

    if (emailDoc.workspaceId.userId.toString() !== req.userId)
      return res.status(403).json({ message: "Unauthorized" });

    const toEmail = emailDoc.recipientId.email;
    if (!toEmail) {
      return res.status(400).json({ message: "Recipient missing email address" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const htmlBody = emailDoc.body.replace(/\n/g, "<br>");

    const mailOptions = {
      from: `"Mailto Outreach" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: emailDoc.subject,
      html: htmlBody,
    };

    await transporter.sendMail(mailOptions);

    emailDoc.status = "sent";
    emailDoc.sentAt = new Date();
    await emailDoc.save();

    res.json({ message: "Email sent via Gmail", email: emailDoc });

  } catch (err) {
    console.error("SEND EMAIL ERROR:", err.message);
    res.status(500).json({ message: "Failed to send email", error: err.message });
  }
});


// UPDATE EXISTING DRAFT
router.patch("/:id", userMiddleware, async (req, res) => {
  try {
    const { subject, body } = req.body;

    const email = await Email.findById(req.params.id).populate("workspaceId");
    if (!email) return res.status(404).json({ message: "Email not found" });

    if (email.workspaceId.userId.toString() !== req.userId)
      return res.status(403).json({ message: "Unauthorized" });

    if (subject) email.subject = subject;
    if (body) email.body = body;

    await email.save();
    res.json({ message: "Email updated", email });
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
});


// GET SINGLE EMAIL
router.get("/:id", userMiddleware, async (req, res) => {
  try {
    const email = await Email.findById(req.params.id);
    if (!email) return res.status(404).json({ message: "Not found" });

    res.json(email);
  } catch (err) {
    res.status(500).json({ message: "Error loading email" });
  }
});


// GET ALL EMAILS FOR WORKSPACE
router.get("/workspace/:workspaceId", userMiddleware, async (req, res) => {
  try {
    const emails = await Email.find({
      workspaceId: req.params.workspaceId,
    }).sort({ createdAt: -1 });

    res.json(emails);
  } catch (err) {
    res.status(500).json({ message: "Error fetching emails" });
  }
});

module.exports = router;
