import MentorProfile from "../models/MentorProfile.js";
import RecommendationLog from "../models/RecommendationLog.js";
import Review from "../models/Review.js";
import Session from "../models/Session.js";
import User from "../models/User.js";

const userFields = "-password";
const mentorPopulateFields = "name email branch year skillsKnown skillsWanted skillPoints role isMentor createdAt";

const recalculateMentorRating = async (mentorProfileId) => {
  const reviews = await Review.find({ mentorProfileId });
  const totalReviews = reviews.length;
  const rating =
    totalReviews === 0
      ? 0
      : reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;

  await MentorProfile.findByIdAndUpdate(mentorProfileId, {
    rating: Number(rating.toFixed(1)),
    totalReviews
  });
};

export const getAdminDashboard = async (req, res) => {
  try {
    const [
      totalUsers,
      totalMentors,
      verifiedMentors,
      pendingMentors,
      totalSessions,
      completedSessions,
      totalReviews,
      topSkills
    ] = await Promise.all([
      User.countDocuments(),
      MentorProfile.countDocuments(),
      MentorProfile.countDocuments({ isVerified: true }),
      MentorProfile.countDocuments({ isVerified: false }),
      Session.countDocuments(),
      Session.countDocuments({ status: "COMPLETED" }),
      Review.countDocuments(),
      MentorProfile.aggregate([
        { $unwind: "$skills" },
        { $group: { _id: "$skills", count: { $sum: 1 } } },
        { $sort: { count: -1, _id: 1 } },
        { $limit: 10 },
        { $project: { _id: 0, skill: "$_id", count: 1 } }
      ])
    ]);

    res.status(200).json({
      success: true,
      dashboard: {
        totalUsers,
        totalMentors,
        verifiedMentors,
        pendingMentors,
        totalSessions,
        completedSessions,
        totalReviews,
        topSkills
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Could not fetch admin dashboard",
      error: error.message
    });
  }
};

export const getAdminUsers = async (req, res) => {
  try {
    const users = await User.find().select(userFields).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Could not fetch users",
      error: error.message
    });
  }
};

export const getAdminMentors = async (req, res) => {
  try {
    const mentors = await MentorProfile.find()
      .populate("userId", mentorPopulateFields)
      .sort({ isVerified: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: mentors.length,
      mentors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Could not fetch mentors",
      error: error.message
    });
  }
};

export const verifyMentor = async (req, res) => {
  try {
    const mentor = await MentorProfile.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true, runValidators: true }
    ).populate("userId", mentorPopulateFields);

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor profile not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Mentor profile verified successfully",
      mentor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Could not verify mentor profile",
      error: error.message
    });
  }
};

export const rejectMentor = async (req, res) => {
  try {
    const mentor = await MentorProfile.findById(req.params.id).populate("userId", mentorPopulateFields);

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor profile not found"
      });
    }

    // Reset the user's isMentor flag so they can re-apply if needed
    await User.findByIdAndUpdate(mentor.userId._id, { isMentor: false });

    // Delete the mentor profile entirely
    await MentorProfile.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Mentor profile rejected and removed successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Could not reject mentor profile",
      error: error.message
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "Admin cannot delete their own account from this endpoint"
      });
    }

    const affectedReviews = await Review.find({
      $or: [{ learnerId: user._id }, { mentorId: user._id }]
    }).select("mentorProfileId");
    const affectedMentorProfileIds = [
      ...new Set(affectedReviews.map((review) => review.mentorProfileId.toString()))
    ];

    await Promise.all([
      MentorProfile.deleteOne({ userId: user._id }),
      Session.deleteMany({
        $or: [{ learnerId: user._id }, { mentorId: user._id }]
      }),
      Review.deleteMany({
        $or: [{ learnerId: user._id }, { mentorId: user._id }]
      }),
      RecommendationLog.deleteMany({ userId: user._id })
    ]);

    await User.findByIdAndDelete(user._id);

    await Promise.all(
      affectedMentorProfileIds.map((mentorProfileId) => recalculateMentorRating(mentorProfileId))
    );

    res.status(200).json({
      success: true,
      message: "User and related data deleted safely"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Could not delete user",
      error: error.message
    });
  }
};
