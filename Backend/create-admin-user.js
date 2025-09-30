const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/hackforge");

// Import User model
const User = require("./src/models/user.model");

async function createAdminUser() {
  try {
    console.log("🔧 Creating admin user...");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      console.log("✅ Admin user already exists:");
      console.log("   Email:", existingAdmin.email);
      console.log("   Name:", existingAdmin.firstName, existingAdmin.lastName);
      console.log("   Role:", existingAdmin.role);
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 10);
    
    const adminUser = new User({
      firstName: "Admin",
      lastName: "User",
      email: "admin@hackforge.com",
      password: hashedPassword,
      role: "admin",
      isVerified: true
    });

    await adminUser.save();
    
    console.log("✅ Admin user created successfully!");
    console.log("   Email: admin@hackforge.com");
    console.log("   Password: admin123");
    console.log("   Role: admin");
    console.log("\n🔑 You can now login with these credentials");

  } catch (error) {
    console.error("❌ Error creating admin user:", error.message);
  } finally {
    mongoose.disconnect();
  }
}

createAdminUser();
