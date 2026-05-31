import MentorProfile from "../models/MentorProfile.js";
import RecommendationLog from "../models/RecommendationLog.js";
import Review from "../models/Review.js";
import Session from "../models/Session.js";

const userFields = "name email branch year skillsKnown skillsWanted skillPoints role isMentor createdAt";
const sessionPopulateFields = "name email branch year skillsKnown";

export const getStudentDashboard = async (req, res) => {
  try {
    const today = new Date();

    const [
      totalBookedSessions,
      pendingSessions,
      completedSessions,
      upcomingSessions,
      recentRecommendations
    ] = await Promise.all([
      Session.countDocuments({ learnerId: req.user._id }),
      Session.countDocuments({ learnerId: req.user._id, status: "PENDING" }),
      Session.countDocuments({ learnerId: req.user._id, status: "COMPLETED" }),
      Session.find({
        learnerId: req.user._id,
        status: "ACCEPTED",
        date: { $gte: today }
      })
        .populate("mentorId", sessionPopulateFields)
        .populate("mentorProfileId", "bio skills experienceLevel mode location rating totalReviews")
        .sort({ date: 1, startTime: 1 })
        .limit(5),
      RecommendationLog.find({ userId: req.user._id })
        .select("goalText extractedSkills learningPath recommendedMentors createdAt")
        .sort({ createdAt: -1 })
        .limit(5)
    ]);

    res.status(200).json({
      success: true,
      dashboard: {
        user: {
          _id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          branch: req.user.branch,
          year: req.user.year,
          skillsKnown: req.user.skillsKnown,
          skillsWanted: req.user.skillsWanted,
          role: req.user.role,
          isMentor: req.user.isMentor,
          createdAt: req.user.createdAt
        },
        skillPoints: req.user.skillPoints,
        totalBookedSessions,
        pendingSessions,
        completedSessions,
        upcomingSessions,
        skillsWanted: req.user.skillsWanted,
        recentRecommendations
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Could not fetch student dashboard",
      error: error.message
    });
  }
};

export const getMentorDashboard = async (req, res) => {
  try {
    if (!req.user.isMentor) {
      return res.status(403).json({
        success: false,
        message: "Mentor dashboard is available only for mentors"
      });
    }

    const mentorProfile = await MentorProfile.findOne({ userId: req.user._id }).populate(
      "userId",
      userFields
    );

    if (!mentorProfile) {
      return res.status(404).json({
        success: false,
        message: "Mentor profile not found"
      });
    }

    const [
      totalSessionRequests,
      pendingRequests,
      acceptedSessions,
      completedSessions,
      earnedPointsResult,
      recentReviews
    ] = await Promise.all([
      Session.countDocuments({ mentorId: req.user._id }),
      Session.countDocuments({ mentorId: req.user._id, status: "PENDING" }),
      Session.countDocuments({ mentorId: req.user._id, status: "ACCEPTED" }),
      Session.countDocuments({ mentorId: req.user._id, status: "COMPLETED" }),
      Session.aggregate([
        { $match: { mentorId: req.user._id, status: "COMPLETED" } },
        { $group: { _id: null, earnedPoints: { $sum: "$pointsUsed" } } }
      ]),
      Review.find({ mentorProfileId: mentorProfile._id })
        .populate("learnerId", sessionPopulateFields)
        .sort({ createdAt: -1 })
        .limit(5)
    ]);

    res.status(200).json({
      success: true,
      dashboard: {
        mentorProfile,
        totalSessionRequests,
        pendingRequests,
        acceptedSessions,
        completedSessions,
        rating: mentorProfile.rating,
        totalReviews: mentorProfile.totalReviews,
        earnedPoints: earnedPointsResult[0]?.earnedPoints || 0,
        recentReviews
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Could not fetch mentor dashboard",
      error: error.message
    });
  }
};
