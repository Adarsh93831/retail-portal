const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");


const normalizeModelText = (content) => {
  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    return content
      .map((item) => {
        if (typeof item === "string") {
          return item;
        }

        if (item && typeof item.text === "string") {
          return item.text;
        }

        return "";
      })
      .join(" ");
  }

  return "";
};


const extractJsonObject = (rawText) => {
  const cleanedText = rawText.replace(/```json|```/g, "").trim();
  const jsonStart = cleanedText.indexOf("{");
  const jsonEnd = cleanedText.lastIndexOf("}");

  if (jsonStart === -1 || jsonEnd === -1 || jsonEnd <= jsonStart) {
    throw new Error("AI response did not include a valid JSON object.");
  }

  const jsonString = cleanedText.slice(jsonStart, jsonEnd + 1);
  return JSON.parse(jsonString);
};

const generateProductDetails = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Product title is required.",
        code: "TITLE_REQUIRED",
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "GEMINI_API_KEY is missing in server environment variables.",
        code: "GEMINI_KEY_MISSING",
      });
    }

    const model = new ChatGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY,
      model: "gemini-1.5-flash",
      temperature: 0.4,
    });

    const prompt = `You are an assistant for an e-commerce admin panel.
Generate structured product details for the title: "${title.trim()}".

Return ONLY valid JSON with this exact shape:
{
  "description": "2 to 4 sentence engaging product description",
  "taxPercent": 18,
  "suggestedAddOns": [
    { "name": "Extra Cheese", "price": 25 },
    { "name": "Chili Dip", "price": 15 }
  ]
}

Rules:
1) taxPercent must be a number between 5 and 28.
2) suggestedAddOns must have 2 to 4 items.
3) Every add-on price must be a number.
4) Do not include markdown text, explanations, or code fences.`;

    const aiResponse = await model.invoke(prompt);
    const aiText = normalizeModelText(aiResponse.content);
    const parsed = extractJsonObject(aiText);

    const data = {
      description: parsed.description || "",
      taxPercent: Number(parsed.taxPercent || 0),
      suggestedAddOns: Array.isArray(parsed.suggestedAddOns) ? parsed.suggestedAddOns : [],
    };

    return res.status(200).json({
      success: true,
      data,
      message: "AI product details generated successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        "Could not generate product details right now. Please try again with a different title.",
      code: "AI_GENERATION_FAILED",
    });
  }
};

module.exports = {
  generateProductDetails,
};
