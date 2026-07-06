import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import User from "./src/models/User.js";

dotenv.config();

const resetPoints = async () => {
  try {
    await connectDB();
    console.log("Connected to MongoDB.");

    await User.updateMany({}, { $set: { skillPoints: 100 } });
    console.log("Successfully set all users' skill points to 100.");

    process.exit(0);
  } catch (error) {
    console.error("Error resetting skill points:", error);
    process.exit(1);
  }
};

resetPoints();
