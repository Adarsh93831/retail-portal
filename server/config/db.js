const mongoose = require("mongoose");

/**
 * Connects the backend server to MongoDB Atlas.
 * This function should run once when the server starts.
 */
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
