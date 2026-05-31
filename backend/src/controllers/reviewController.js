import MentorProfile from "../models/MentorProfile.js";
import Review from "../models/Review.js";
import Session from "../models/Session.js";

const userFields = "name email branch year skillsKnown";

export const createReview = async (req, res) => {
  try {
    const { sessionId, rating, comment } = req.body;

    if (!sessionId || rating === undefined) {
      return res.status(400).json({
        success: false,
        message: "Session ID and rating are required"
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5"
      });
    }

    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found"
      });
    }

    if (session.learnerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only the learner can review this session"
      });
    }

    if (session.status !== "COMPLETED") {
      return res.status(400).json({
        success: false,
        message: "Only completed sessions can be reviewed"
      });
    }

    const existingReview = await Review.findOne({ sessionId });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "This session has already been reviewed"
      });
    }

    const review = await Review.create({
      sessionId: session._id,
      learnerId: session.learnerId,
      mentorId: session.mentorId,
      mentorProfileId: session.mentorProfileId,
      rating,
      comment
    });

    const mentorProfile = await MentorProfile.findById(session.mentorProfileId);

    if (mentorProfile) {
      const oldRating = mentorProfile.rating;
      const oldTotalReviews = mentorProfile.totalReviews;
      const newAverage = ((oldRating * oldTotalReviews) + Number(rating)) / (oldTotalReviews + 1);

      mentorProfile.rating = Number(newAverage.toFixed(1));
      mentorProfile.totalReviews = oldTotalReviews + 1;
      await mentorProfile.save();
    }

    const populatedReview = await Review.findById(review._id)
      .populate("learnerId", userFields)
      .populate("mentorId", userFields)
      .populate("mentorProfileId", "bio skills experienceLevel rating totalReviews");

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      review: populatedReview
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Could not add review",
      error: error.message
    });
  }
};

export const getMentorReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ mentorProfileId: req.params.mentorProfileId })
      .populate("learnerId", userFields)
      .populate("mentorId", userFields)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Could not fetch mentor reviews",
      error: error.message
    });
  }
};
