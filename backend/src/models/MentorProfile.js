import mongoose from "mongoose";

const availableSlotSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      required: true,
      trim: true
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
    }
  },
  { _id: false }
);

const mentorProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },
  bio: {
    type: String,
    required: true,
    trim: true
  },
  skills: {
    type: [String],
    required: true,
    default: []
  },
  experienceLevel: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced"],
    required: true
  },
  availableSlots: {
    type: [availableSlotSchema],
    default: []
  },
  mode: {
    type: String,
    enum: ["Online", "Offline", "Both"],
    required: true
  },
  location: {
    type: String,
    trim: true
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const MentorProfile = mongoose.model("MentorProfile", mentorProfileSchema);

export default MentorProfile;
