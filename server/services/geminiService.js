const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GEMINI_API_KEY } = require("../config");

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

exports.generateContextSummary = async (intent, intentData) => {
  try {
    let prompt = `Summarize the sender context for a ${intent} outreach:\n`;

    for (const key in intentData) {
      prompt += `${key}: ${intentData[key]}\n`;
    }

    prompt += `
    Write as if you're the sender.
    Make it motivating and professional.
    Do NOT list fields like "name:" or "budget:" directly.
    Output 3-6 sentences, fluent and natural.
`;

    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
    });

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return text;
  } catch (err) {
    console.error("Gemini Context Summary Error:", err.message);
    throw new Error("Failed to generate context summary");
  }
};
