const axios = require("axios");

async function testLeaderboard() {
  try {
    console.log("Testing leaderboard API...");

    // Test without authentication first
    const response = await axios.get("http://localhost:5000/leaderboard", {
      timeout: 5000,
    });

    console.log("Response:", response.data);
  } catch (error) {
    console.error(
      "Error testing leaderboard:",
      error.response?.data || error.message
    );
    console.error("Status:", error.response?.status);
  }
}

testLeaderboard();


