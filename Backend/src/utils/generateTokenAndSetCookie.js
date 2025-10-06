const jwt = require("jsonwebtoken");

const generateTokenAndSetCookie = async (res, userId, role) => {
  const token = jwt.sign({ userId, role }, process.env.JWT_SECRET_KEY, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // ✅ 7 days
    httpOnly: true, // ✅ Prevent JS access (security)
    sameSite: "none", // ✅ Required for cross-site
    secure: true, // ✅ Always true (Render is HTTPS)
  });

  return token;
};

module.exports = { generateTokenAndSetCookie };
