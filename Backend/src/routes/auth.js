const express = require("express");

const {
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
} = require("../controllers/auth.controller");

const userMiddleware = require("../middleware/userMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const verifyToken = require("../middleware/verifyToken");
const { loginLimiter } = require("../middleware/loginLimiter");

const authRouter = express.Router();

authRouter.get("/check-auth", verifyToken, checkAuth); // Will be checked whenever we refresh the page

authRouter.post("/signup", signup);
authRouter.post("/verify-email", verifyEmail);
authRouter.post("/login", loginLimiter, login);
authRouter.post("/google-auth", googleAuth); // New Google authentication route
authRouter.post("/logout", userMiddleware, logout);
authRouter.post("/admin/register", adminMiddleware, adminRegister);
authRouter.delete("/profile", userMiddleware, deleteProfile);

authRouter.post("/forgot-password", forgotpassword);
authRouter.post("/reset-password/:token", resetPassword);

module.exports = { authRouter };
