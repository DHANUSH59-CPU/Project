// middleware/rateLimiter.js
const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3,
  message: {
    success: false,
    message: "Too many login attempts. Try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { loginLimiter };
