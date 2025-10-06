const { GoogleGenerativeAI } = require("@google/generative-ai");

// Check if API key is provided
if (!process.env.GEMINI_API_KEY) {
  // GEMINI_API_KEY is not set in environment variables
}

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Create the model instance
const models = {
  generateContent: async (params) => {
    try {
      const model = genAI.getGenerativeModel({
        model: params.model || "gemini-2.0-flash",
        systemInstruction: params.config?.systemInstruction,
      });

      // For Gemini API, we need to send the content as a string, not as chat history
      let contentToSend;
      if (params.contents && params.contents.length > 0) {
        // Get the last user message
        const lastUserMessage = params.contents
          .filter((msg) => msg.role === "user")
          .pop();

        if (
          lastUserMessage &&
          lastUserMessage.parts &&
          lastUserMessage.parts[0]
        ) {
          contentToSend = lastUserMessage.parts[0].text;
        } else {
          contentToSend = "Hello";
        }
      } else {
        contentToSend = "Hello";
      }

      const result = await model.generateContent(contentToSend);
      const response = await result.response;

      return {
        text: response.text(),
      };
    } catch (error) {
      throw error;
    }
  },
};

module.exports = { models };
