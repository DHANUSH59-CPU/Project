const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./src/models/user.model");

async function createTestUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/hackforge"
    );
    console.log("Connected to MongoDB");

    // Check if test user already exists
    const existingUser = await User.findOne({ emailId: "test@example.com" });
    if (existingUser) {
      console.log("✅ Test user already exists:", existingUser.emailId);
      return existingUser;
    }

    // Create test user
    const hashedPassword = await bcrypt.hash("password123", 10);

    const testUser = new User({
      firstName: "Test",
      lastName: "User",
      emailId: "test@example.com",
      password: hashedPassword,
      role: "user",
      isVerified: true,
      points: 150,
      streaks: {
        current: 5,
        longest: 10,
        lastUpdated: new Date(),
      },
      checkedProblems: [],
    });

    await testUser.save();
    console.log("✅ Test user created successfully:", testUser.emailId);
    return testUser;
  } catch (error) {
    console.error("❌ Error creating test user:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

createTestUser();
