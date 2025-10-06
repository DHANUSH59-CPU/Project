const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized - no token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!decoded) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - invalid token" });
    }

    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    console.log("Error in verifyToken:", error.message);

    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - token expired" });
    }

    if (error.name === "JsonWebTokenError") {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - invalid token" });
    }

    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = verifyToken;
