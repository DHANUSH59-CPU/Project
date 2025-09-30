const axios = require("axios");

const BASE_URL = "http://localhost:5000";

// Test user credentials (you'll need to replace with actual credentials)
const testCredentials = {
  emailId: "test@example.com",
  password: "password123",
};

let authToken = "";

async function login() {
  try {
    console.log("🔐 Testing login...");
    const response = await axios.post(
      `${BASE_URL}/user/login`,
      testCredentials
    );
    console.log("✅ Login successful");

    // Extract token from response
    authToken = response.data.token;
    console.log("🎫 Auth token received");
    return true;
  } catch (error) {
    console.error("❌ Login failed:", error.response?.data || error.message);
    return false;
  }
}

async function testGetProfile() {
  try {
    console.log("\n📊 Testing GET /profile...");
    const response = await axios.get(`${BASE_URL}/profile`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    console.log("✅ Profile retrieved successfully");
    console.log("📈 User stats:", {
      firstName: response.data.firstName,
      lastName: response.data.lastName,
      points: response.data.points,
      totalProblemsSolved: response.data.statistics?.totalProblemsSolved,
      currentStreak: response.data.statistics?.currentStreak,
      longestStreak: response.data.statistics?.longestStreak,
    });
    return true;
  } catch (error) {
    console.error(
      "❌ Get profile failed:",
      error.response?.data || error.message
    );
    return false;
  }
}

async function testUpdateProfile() {
  try {
    console.log("\n✏️ Testing PUT /profile...");
    const updateData = {
      firstName: "Updated",
      lastName: "User",
      age: 25,
      profileImageUrl: "https://example.com/profile.jpg",
    };

    const response = await axios.put(`${BASE_URL}/profile`, updateData, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    console.log("✅ Profile updated successfully");
    console.log("📝 Updated data:", {
      firstName: response.data.user.firstName,
      lastName: response.data.user.lastName,
      age: response.data.user.age,
      profileImageUrl: response.data.user.profileImageUrl,
    });
    return true;
  } catch (error) {
    console.error(
      "❌ Update profile failed:",
      error.response?.data || error.message
    );
    return false;
  }
}

async function testGetActivity() {
  try {
    console.log("\n📱 Testing GET /profile/activity...");
    const response = await axios.get(`${BASE_URL}/profile/activity`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    console.log("✅ Activity retrieved successfully");
    console.log("📊 Activity data:", {
      solvedProblemsCount: response.data.solvedProblems?.length || 0,
      sprintActivitiesCount: response.data.sprintActivities?.length || 0,
    });
    return true;
  } catch (error) {
    console.error(
      "❌ Get activity failed:",
      error.response?.data || error.message
    );
    return false;
  }
}

async function testGetAchievements() {
  try {
    console.log("\n🏆 Testing GET /profile/achievements...");
    const response = await axios.get(`${BASE_URL}/profile/achievements`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    console.log("✅ Achievements retrieved successfully");
    console.log("🎯 Achievements data:", {
      totalAchievements: response.data.totalAchievements,
      categories: response.data.categories,
    });
    return true;
  } catch (error) {
    console.error(
      "❌ Get achievements failed:",
      error.response?.data || error.message
    );
    return false;
  }
}

async function testChangePassword() {
  try {
    console.log("\n🔒 Testing PUT /profile/password...");
    const passwordData = {
      currentPassword: "password123",
      newPassword: "newpassword123",
    };

    const response = await axios.put(
      `${BASE_URL}/profile/password`,
      passwordData,
      {
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );

    console.log("✅ Password changed successfully");
    console.log("🔐 Password update message:", response.data.message);
    return true;
  } catch (error) {
    console.error(
      "❌ Change password failed:",
      error.response?.data || error.message
    );
    return false;
  }
}

async function runAllTests() {
  console.log("🚀 Starting Profile Management API Tests");
  console.log("=".repeat(50));

  const results = {
    login: false,
    getProfile: false,
    updateProfile: false,
    getActivity: false,
    getAchievements: false,
    changePassword: false,
  };

  // Test login first
  results.login = await login();

  if (!results.login) {
    console.log("\n❌ Cannot proceed without authentication");
    return;
  }

  // Test all profile endpoints
  results.getProfile = await testGetProfile();
  results.updateProfile = await testUpdateProfile();
  results.getActivity = await testGetActivity();
  results.getAchievements = await testGetAchievements();
  results.changePassword = await testChangePassword();

  // Summary
  console.log("\n" + "=".repeat(50));
  console.log("📋 TEST RESULTS SUMMARY");
  console.log("=".repeat(50));

  const passed = Object.values(results).filter(Boolean).length;
  const total = Object.keys(results).length;

  Object.entries(results).forEach(([test, result]) => {
    console.log(
      `${result ? "✅" : "❌"} ${test}: ${result ? "PASSED" : "FAILED"}`
    );
  });

  console.log(`\n🎯 Overall: ${passed}/${total} tests passed`);

  if (passed === total) {
    console.log("🎉 All profile management tests passed!");
  } else {
    console.log("⚠️ Some tests failed. Check the logs above.");
  }
}

// Run the tests
runAllTests().catch(console.error);
