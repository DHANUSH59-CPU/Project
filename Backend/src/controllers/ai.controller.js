const ai = require("../config/ai");
const createSystemInstructionWithContext = require("../utils/createSystemInstructionWithContext");

const chatAI = async (req, res) => {
  try {
    const { problemDetails, userSolution, chatHistory } = req.body;

    if (!problemDetails) {
      return res.status(400).send({ error: "Missing problemDetails" });
    }

    // userSolution can be empty if user hasn't written code yet
    const userSolutionToSend = userSolution || "";

    if (!chatHistory) {
      return res.status(400).send({ error: "Missing chatHistory" });
    }

    const { firstName } = req.result; // Get user's first name from the authenticated user

    // Format the chat history for Gemini API
    const formattedHistory = chatHistory.map((chat) => ({
      role: chat.role,
      parts: chat.parts,
    }));

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: formattedHistory,
      config: {
        systemInstruction: createSystemInstructionWithContext(
          firstName,
          problemDetails,
          userSolutionToSend
        ),
      },
    });

    res.status(201).send(response.text);
  } catch (error) {
    res.status(500).send({
      error: error.message,
      details: error.status || error.code || "Unknown error",
    });
  }
};

module.exports = { chatAI };
