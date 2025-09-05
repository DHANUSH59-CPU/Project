const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATA_BASE_URL);
    console.log(`MongoDB connected : ${conn.connection.host}`);
  } catch (error) {
    console.log("Error connection to Mongoose :", error.message);
    process.exit(1); // 1 is failure and, 0 is success status code
  }
};

module.exports = { connectDB };
