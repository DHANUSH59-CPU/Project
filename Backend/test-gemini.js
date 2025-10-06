const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

async function testGemini() {
  try {
    console.log("Testing Gemini API...");
    console.log("API Key exists:", !!process.env.GEMINI_API_KEY);

    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY not found in environment variables");
      return;
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent(
      "Hello, can you respond with 'API is working'?"
    );
    const response = await result.response;

    console.log("✅ Gemini API is working!");
    console.log("Response:", response.text());
  } catch (error) {
    console.error("❌ Gemini API test failed:");
    console.error("Error:", error.message);
    console.error("Status:", error.status);
    console.error("Code:", error.code);
  }
}

testGemini();
