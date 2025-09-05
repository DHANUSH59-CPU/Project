const User = require("../models/user.model");
const redisClient = require("../config/redis");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

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

    res.clearCookie("token");
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
    res.status(400).json({ success: false, message: error.message });
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

module.exports = {
  signup,
  verifyEmail,
  login,
  logout,
  forgotpassword,
  resetPassword,
  checkAuth,
  adminRegister,
};
