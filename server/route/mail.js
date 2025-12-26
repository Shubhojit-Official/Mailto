const Lead = require("../model/Recipient");
const contextModel = require("../model/SenderContext");
const Workspace = require("../model/Workspace")
const Email = require("../model/Email");
const userMiddleware = require("../middleware/userMiddleware");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const Router = require("express");
const mailRouter = Router()

// mail
mailRouter.post("/generate", userMiddleware, async (req, res) => {
    try {
        const { leadId, workspaceId, personalization, formality, persuasiveness } = req.body;

        if (!leadId || !workspaceId) {
            return res.status(400).json({
                message: "leadId and workspaceId are required",
                code: 400,
            });
        }

        // Fetch Lead
        const lead = await Lead.findOne({ _id: leadId, userId: req.userId });

        if (!lead) {
            return res.status(404).json({
                message: "Lead not found or unauthorized",
                code: 404,
            });
        }

        // Fetch Context
        const context = await contextModel.findOne({ workspaceId });

        if (!context) {
            return res.status(404).json({
                message: "Context not found for workspace",
                code: 404,
            });
        }

        // Slider Config for prompting
        const toneDetails = `
        Formality Level: ${formality}/100
        Directness Level: ${persuasiveness}/100
        Personalization Depth: ${personalization}/100
        `;

        // Prompt
        const prompt = `
        You are an expert cold email writer.
        Write a personalized outreach email using:
        1. Personality Insight:
        "${lead.personalitySummary}"
        2. Context Mode: ${context.mode}
        ${context.mode === "pitch" ? `
            - What we sell: ${context.whatSelling}
            - Target Audience: ${context.targetAudience}
            - Core Value: ${context.coreValue}
            - Proof: ${context.proof}`
                : context.mode === "job" ? `
        - Role Seeking: ${context.roleSeeking}
        - Skills: ${context.skills}
        - Experience: ${context.experience}
        - Why Me: ${context.whyYou}` : `
        - Collaboration Idea: ${context.collabIdea}
        - Why Them: ${context.whyThem}
        - What We Provide: ${context.whatYouProvide}`
            }
        Tone Guidance: 
        ${toneDetails}

        Requirements:
        - 3-5 short paragraphs
        - Do NOT mention tweets or social media directly
        - Avoid cringe buzzwords
        - Soft call to action
        - Subject line + Email body separated like:

        Subject: <line here>

        Body:
        <email body here>
        `;

        // Gemini API
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const result = await model.generateContent(prompt);
        const aiResponse = result.response.text().trim();

        const [subjectLine, ...bodyArr] = aiResponse.split("\n");
        const subject = subjectLine.replace("Subject:", "").trim();
        const body = bodyArr.join("\n").trim();

        // Save generated email to DB
        const email = await Email.create({
            leadId,
            workspaceId,
            subject,
            body,
            personalization,
            formality,
            persuasiveness,
        });

        return res.status(200).json({
            message: "Email generated successfully",
            workspaceId,
            email,
            code: 200,
        });

    } catch (err) {
        console.error("Generate Mail Error:", err.message);
        return res.status(500).json({
            message: "Error generating personalized email",
            error: err.message,
            code: 500,
        });
    }
});

// get all enails
mailRouter.get("/all/:workspaceId", userMiddleware, async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const userId = req.userId;

        // Check if workspace belongs to logged-in user
        const workspaceExists = await Workspace.findOne({ _id: workspaceId, userId });
        if (!workspaceExists) {
            return res.status(403).json({
                message: "Workspace not found or unauthorized",
                code: 403,
            });
        }

        // Direct fetch (NEW ✔)
        const emails = await Email.find({ workspaceId })
            .sort({ createdAt: -1 })
            .populate("leadId", "email personalitySummary");

        return res.status(200).json({
            message: "Fetched workspace emails",
            count: emails.length,
            emails,
            code: 200,
        });

    } catch (err) {
        return res.status(500).json({
            message: "Internal server error",
            error: err.message,
            code: 500,
        });
    }
});


module.exports = mailRouter;
