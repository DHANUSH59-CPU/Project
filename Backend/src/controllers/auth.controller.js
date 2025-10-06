/**
 * AlgoMaster Authentication Controller
 * Handles user registration, login, and authentication
 */

const User = require("../models/user.model");
const Submission = require("../models/submission.model");
const Like = require("../models/like.model");
const Favorite = require("../models/favorite.model");
const Comment = require("../models/comment.model");
const redisClient = require("../config/redis");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library");

const {
  generateTokenAndSetCookie,
} = require("../utils/generateTokenAndSetCookie");
const validate = require("../utils/validator");

const {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendResetSuccessEmail,
} = require("../mailtrap/email");

const signup = async (req, res) => {
  validate(req.body);

  const { emailId, firstName, password, role } = req.body;
  try {
    if (!emailId || !firstName || !password) {
      throw new Error("All fields are required");
    }

    const userAlreadyExists = await User.findOne({ emailId });

    if (userAlreadyExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already Exist" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    // 12345 => Not readable

    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const user = new User({
      emailId,
      password: hashPassword,
      firstName,
      role: "user",
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });

    await user.save();
    // await sendVerificationEmail(user.emailId, verificationToken);

    // jwt
    generateTokenAndSetCookie(res, user._id, user.role);

    res.status(201).json({
      success: true,
      message: "User created succefully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
    console.log("Error Occures while singup : ", err.message);
  }
};

const verifyEmail = async (req, res) => {
  const { code } = req.body;

  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expire verification code",
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;

    await user.save();
    await sendWelcomeEmail(user.emailId, user.firstName);

    res.status(200).json({
      success: true,
      message: "Email verified Sucessfully",

      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

const login = async (req, res) => {
  validate(req.body);
  const { emailId, password } = req.body;

  try {
    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // comparing the password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    generateTokenAndSetCookie(res, user._id, user.role);
    user.lastLogin = new Date();
    await user.save();

    res.status(201).json({
      sucess: true,
      message: "Logged in Sucessfully",
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    console.log("Error in login", error);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const logout = async (req, res) => {
  // we will add Blocked Tokens into reddis here
  // passport example for reddis
  try {
    const token = req.cookies?.token;

    const payload = jwt.decode(token);
    // console.log(payload);

    await redisClient.set(`token:${token}`, "Blocked");
    await redisClient.expireAt(`token:${token}`, payload.exp);

    res.cookie("token", "", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      expires: new Date(0),
    });
    res.status(200).json({ success: true, message: "Logout is successfull" });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};

const forgotpassword = async (req, res) => {
  const { emailId } = req.body;
  try {
    const user = await User.findOne({ emailId });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Generate reset token and expiry time
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;

    await user.save();

    // send email
    await sendPasswordResetEmail(
      user.emailId,
      `http://localhost:5173/reset-password/${resetToken}`
    );

    return res.status(200).json({
      success: true,
      message: "Password reset email link sent",
    });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "invalid or expired reset token" });
    }

    // Update the password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;

    await user.save();

    await sendResetSuccessEmail(user.emailId);
    return res
      .status(200)
      .json({ success: true, message: "Password reset Sucessfully" });
  } catch (error) {
    console.log("Error in resetPassowrd", error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Error in checkAuth ", error);
    res.status(400).json({
      success: false,
      message: error.message,
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  }
};

const adminRegister = async (req, res) => {
  try {
    validate(req.body);

    const { emailId, password, firstName } = req.body;

    if (!emailId || !password || !firstName)
      throw new Error("All fields are required");

    const userAlreadyExists = await User.findOne({ emailId });
    if (userAlreadyExists) {
      return res
        .status(400)
        .json({ sucess: false, message: "User Already Exists" });
    }

    // Hashing the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const user = new User({
      emailId,
      password: hashedPassword,
      firstName,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      role: "admin",
    });

    await user.save();

    // await sendVerificationEmail(user.emailId, verificationToken)

    // JWT Token
    generateTokenAndSetCookie(res, user._id, "admin");
    res.status(201).json({
      sucess: true,
      message: "Created Sucessfully",
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteProfile = async (req, res) => {
  try {
    const userId = req.userId; // Get userId from middleware

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete user submissions first
    await Submission.deleteMany({ userId });

    // Delete user's social interactions (likes, favorites, comments)
    await Like.deleteMany({ user: userId });
    await Favorite.deleteMany({ user: userId });
    await Comment.deleteMany({ user: userId });

    // Finally delete the user
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Delete profile error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Google Authentication
const googleAuth = async (req, res) => {
  try {
    const { googleToken, authType } = req.body;

    if (!googleToken || authType !== "google") {
      return res.status(400).json({
        success: false,
        message: "Google token is required",
      });
    }

    // Initialize Google OAuth2 client
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, given_name, family_name, picture, email_verified } = payload;

    if (!email_verified) {
      return res.status(400).json({
        success: false,
        message: "Google email not verified",
      });
    }

    // Check if user already exists
    let user = await User.findOne({ emailId: email });

    if (user) {
      // User exists, log them in
      generateTokenAndSetCookie(res, user._id, user.role);
      user.lastLogin = new Date();
      await user.save();

      return res.status(200).json({
        success: true,
        message: "Logged in successfully with Google",
        user: { ...user._doc, password: undefined },
      });
    } else {
      // User doesn't exist, create new account
      const newUser = new User({
        emailId: email,
        firstName: given_name || email.split("@")[0],
        lastName: family_name || "",
        profileImageUrl: picture || "",
        isVerified: true, // Google accounts are pre-verified
        role: "user",
        authProvider: "google",
        // No password needed for Google auth users
        password: await bcrypt.hash(crypto.randomBytes(32).toString("hex"), 10), // Random password
      });

      await newUser.save();

      // Generate token and set cookie
      generateTokenAndSetCookie(res, newUser._id, newUser.role);

      // Send welcome email (optional)
      // await sendWelcomeEmail(newUser.emailId, newUser.firstName);

      return res.status(201).json({
        success: true,
        message: "Account created and logged in successfully with Google",
        user: { ...newUser._doc, password: undefined },
      });
    }
  } catch (error) {
    console.error("Google authentication error:", error);

    if (
      error.message.includes("Token used too late") ||
      error.message.includes("Invalid token")
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired Google token",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Google authentication failed",
    });
  }
};

module.exports = {
  signup,
  verifyEmail,
  login,
  logout,
  forgotpassword,
  resetPassword,
  checkAuth,
  adminRegister,
  deleteProfile,
  googleAuth,
};
