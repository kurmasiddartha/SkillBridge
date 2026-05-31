import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Session",
    required: true,
    unique: true
  },
  learnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  mentorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  mentorProfileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MentorProfile",
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Review = mongoose.model("Review", reviewSchema);

export default Review;
