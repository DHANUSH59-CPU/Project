const express = require("express");

const cors = require("cors");

const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

const { connectDB } = require("./config/connectDB");
const redisClient = require("./config/redis");

const { authRouter } = require("./routes/auth");
const { problemRouter } = require("./routes/problemRouter");
const { submitRouter } = require("./routes/submissionRouter");
const { aiRouter } = require("./routes/ai");
const { leaderboardRouter } = require("./routes/leaderboard");
const { sprintRouter } = require("./routes/sprint");
const { profileRouter } = require("./routes/profile");
const { activityRouter } = require("./routes/activity");

dotenv.config();
const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(cookieParser()); // Used to deconstruct the token from cookie

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// app.use("/", (req, res) => {
//   res.send("Hello world");
// });

app.use("/user", authRouter);
app.use("/problem", problemRouter);
app.use("/submission", submitRouter);
app.use("/ai", aiRouter);
app.use("/leaderboard", leaderboardRouter);
app.use("/sprint", sprintRouter);
app.use("/profile", profileRouter);
app.use("/activity", activityRouter);

const InitizializeConnection = async () => {
  try {
    await Promise.all([redisClient.connect(), connectDB()]);
    console.log("DB'S Connected");

    app.listen(PORT, () => {
      console.log("Server is listening on port ", PORT);
    });
  } catch (err) {
    console.log("Error : ", err.message);
  }
};

InitizializeConnection();
