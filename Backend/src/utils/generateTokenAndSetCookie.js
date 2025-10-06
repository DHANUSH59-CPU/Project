const jwt = require("jsonwebtoken");

const generateTokenAndSetCookie = async (res, userId, role) => {
  const token = jwt.sign({ userId, role }, process.env.JWT_SECRET_KEY, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    maxAge: 1 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true, // Prevent XSS attacks
    sameSite: "none", // CSRF protection
    secure: process.env.NODE_ENV === "production", // HTTPS only in production
  });

  return token;
};

module.exports = { generateTokenAndSetCookie };
