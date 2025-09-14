const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

const { connectDB } = require("./config/connectDB");
const redisClient = require("./config/redis");

const { authRouter } = require("./routes/auth");
const { problemRouter } = require("./routes/problemRouter");
const { submitRouter } = require("./routes/submit");

dotenv.config();
const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(cookieParser()); // Used to deconstruct the token from cookie

// app.use("/", (req, res) => {
//   res.send("Hello world");
// });

app.use("/user", authRouter);
app.use("/problem", problemRouter);
app.use("/submission", submitRouter);

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
