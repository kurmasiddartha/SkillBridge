import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import MentorProfile from "./src/models/MentorProfile.js";
import RecommendationLog from "./src/models/RecommendationLog.js";
import Review from "./src/models/Review.js";
import Session from "./src/models/Session.js";

dotenv.config();

const clearDb = async () => {
  try {
    await connectDB();

    await MentorProfile.deleteMany({});
    console.log("Cleared MentorProfile collection.");

    await RecommendationLog.deleteMany({});
    console.log("Cleared RecommendationLog collection.");

    await Review.deleteMany({});
    console.log("Cleared Review collection.");

    await Session.deleteMany({});
    console.log("Cleared Session collection.");

    console.log("Database cleared successfully except for users credentials.");
    process.exit(0);
  } catch (error) {
    console.error("Error clearing database:", error);
    process.exit(1);
  }
};

clearDb();
