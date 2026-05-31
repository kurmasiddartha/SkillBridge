import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
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
  skill: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,
    required: true,
    trim: true
  },
  endTime: {
    type: String,
    required: true,
    trim: true
  },
  mode: {
    type: String,
    enum: ["Online", "Offline"],
    required: true
  },
  message: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ["PENDING", "ACCEPTED", "REJECTED", "COMPLETED", "CANCELLED"],
    default: "PENDING"
  },
  pointsUsed: {
    type: Number,
    default: 20,
    min: 1
  },
  meetingLink: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Session = mongoose.model("Session", sessionSchema);

export default Session;
