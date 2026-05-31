import mongoose from "mongoose";

const recommendationLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  goalText: {
    type: String,
    required: true,
    trim: true
  },
  extractedSkills: {
    type: [String],
    default: []
  },
  learningPath: {
    type: [String],
    default: []
  },
  mentorQuestions: {
    type: [String],
    default: []
  },
  recommendedMentors: {
    type: [mongoose.Schema.Types.Mixed],
    default: []
  },
  usedFallback: {
    type: Boolean,
    default: false
  },
  rawAiResponse: {
    type: String,
    default: ""
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const RecommendationLog = mongoose.model("RecommendationLog", recommendationLogSchema);

export default RecommendationLog;
