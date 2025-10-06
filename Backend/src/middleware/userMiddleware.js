const jwt = require("jsonwebtoken");
const redisClient = require("../config/redis");
const User = require("../models/user.model");

const userMiddleware = async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized - No token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!decoded) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - Invalid token" });
    }

    req.userId = decoded.userId;

    const result = await User.findById(req.userId);
    if (!result) {
      return res
        .status(401)
        .json({ success: false, message: "User not exists" });
    }

    const IsBlocked = await redisClient.exists(`token:${token}`);

    if (IsBlocked) throw new Error("Invalid Token");

    req.result = result;
    next(); // ✅ Move to the next middleware or route
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized - Token error" });
  }
};

module.exports = userMiddleware;
