import mongoose from "mongoose";
import MentorProfile from "../models/MentorProfile.js";
import Session from "../models/Session.js";
import User from "../models/User.js";
import Review from "../models/Review.js";

const userFields = "name email branch year skillsKnown skillPoints isMentor";

const populateSession = (query) => {
  return query
    .populate("learnerId", userFields)
    .populate("mentorId", userFields)
    .populate("mentorProfileId", "bio skills experienceLevel mode location rating totalReviews isVerified");
};

export const bookSession = async (req, res) => {
  try {
    const { mentorProfileId, skill, date, startTime, endTime, mode, message, pointsUsed } = req.body;
    const pointsToUse = pointsUsed || 20;

    if (!mentorProfileId || !skill || !date || !startTime || !endTime || !mode) {
      return res.status(400).json({
        success: false,
        message: "Mentor profile, skill, date, start time, end time, and mode are required"
      });
    }

    const mentorProfile = await MentorProfile.findById(mentorProfileId);

    if (!mentorProfile) {
      return res.status(404).json({
        success: false,
        message: "Mentor profile not found"
      });
    }

    if (!mentorProfile.isVerified) {
      return res.status(400).json({
        success: false,
        message: "You can only book verified mentors"
      });
    }

    if (mentorProfile.userId.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot book a session with yourself"
      });
    }

    if (req.user.skillPoints < pointsToUse) {
      return res.status(400).json({
        success: false,
        message: `You need at least ${pointsToUse} skill points to book this session`
      });
    }

    const session = await Session.create({
      learnerId: req.user._id,
      mentorId: mentorProfile.userId,
      mentorProfileId: mentorProfile._id,
      skill,
      date,
      startTime,
      endTime,
      mode,
      message,
      pointsUsed: pointsToUse,
      status: "PENDING"
    });

    const populatedSession = await populateSession(Session.findById(session._id));

    res.status(201).json({
      success: true,
      message: "Session booked successfully and is pending mentor approval",
      session: populatedSession
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Could not book session",
      error: error.message
    });
  }
};

export const getMySessions = async (req, res) => {
  try {
    const sessions = await populateSession(
      Session.find({ learnerId: req.user._id }).sort({ createdAt: -1 })
    );

    const reviews = await Review.find({ learnerId: req.user._id }).select("sessionId");
    const reviewedSessionIds = new Set(reviews.map((r) => r.sessionId.toString()));

    const sessionsWithReviewFlag = sessions.map((session) => {
      const sessionObj = session.toObject();
      sessionObj.isReviewed = reviewedSessionIds.has(session._id.toString());
      return sessionObj;
    });

    res.status(200).json({
      success: true,
      count: sessions.length,
      sessions: sessionsWithReviewFlag
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Could not fetch your sessions",
      error: error.message
    });
  }
};

export const getMentorSessions = async (req, res) => {
  try {
    const sessions = await populateSession(
      Session.find({ mentorId: req.user._id }).sort({ createdAt: -1 })
    );

    res.status(200).json({
      success: true,
      count: sessions.length,
      sessions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Could not fetch mentor sessions",
      error: error.message
    });
  }
};

export const acceptSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }

    if (session.mentorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Only the mentor can accept this session" });
    }

    if (session.status !== "PENDING") {
      return res.status(400).json({ success: false, message: "Only pending sessions can be accepted" });
    }

    session.status = "ACCEPTED";
    session.meetingLink = req.body.meetingLink || session.meetingLink;
    await session.save();

    const populatedSession = await populateSession(Session.findById(session._id));

    res.status(200).json({
      success: true,
      message: "Session accepted successfully",
      session: populatedSession
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Could not accept session",
      error: error.message
    });
  }
};

export const rejectSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }

    if (session.mentorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Only the mentor can reject this session" });
    }

    if (session.status !== "PENDING") {
      return res.status(400).json({ success: false, message: "Only pending sessions can be rejected" });
    }

    session.status = "REJECTED";
    await session.save();

    const populatedSession = await populateSession(Session.findById(session._id));

    res.status(200).json({
      success: true,
      message: "Session rejected successfully",
      session: populatedSession
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Could not reject session",
      error: error.message
    });
  }
};

export const cancelSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }

    const isLearner = session.learnerId.toString() === req.user._id.toString();
    const isMentor = session.mentorId.toString() === req.user._id.toString();

    if (!isLearner && !isMentor) {
      return res.status(403).json({
        success: false,
        message: "Only the learner or mentor can cancel this session"
      });
    }

    if (session.status === "COMPLETED") {
      return res.status(400).json({
        success: false,
        message: "Completed sessions cannot be cancelled"
      });
    }

    if (session.status === "CANCELLED") {
      return res.status(400).json({
        success: false,
        message: "Session is already cancelled"
      });
    }

    session.status = "CANCELLED";
    await session.save();

    const populatedSession = await populateSession(Session.findById(session._id));

    res.status(200).json({
      success: true,
      message: "Session cancelled successfully",
      session: populatedSession
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Could not cancel session",
      error: error.message
    });
  }
};

export const completeSession = async (req, res) => {
  const dbSession = await mongoose.startSession();

  try {
    dbSession.startTransaction();

    const session = await Session.findById(req.params.id).session(dbSession);

    if (!session) {
      await dbSession.abortTransaction();
      return res.status(404).json({ success: false, message: "Session not found" });
    }

    if (session.mentorId.toString() !== req.user._id.toString()) {
      await dbSession.abortTransaction();
      return res.status(403).json({ success: false, message: "Only the mentor can complete this session" });
    }

    if (session.status === "COMPLETED") {
      await dbSession.abortTransaction();
      return res.status(400).json({ success: false, message: "Session is already completed" });
    }

    if (session.status !== "ACCEPTED") {
      await dbSession.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Only accepted sessions can be completed"
      });
    }

    const learner = await User.findById(session.learnerId).session(dbSession);
    const mentor = await User.findById(session.mentorId).session(dbSession);

    if (!learner || !mentor) {
      await dbSession.abortTransaction();
      return res.status(404).json({ success: false, message: "Learner or mentor not found" });
    }

    if (learner.skillPoints < session.pointsUsed) {
      await dbSession.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Learner does not have enough points to complete this session"
      });
    }

    learner.skillPoints -= session.pointsUsed;
    mentor.skillPoints += session.pointsUsed;
    session.status = "COMPLETED";

    await learner.save({ session: dbSession });
    await mentor.save({ session: dbSession });
    await session.save({ session: dbSession });

    await dbSession.commitTransaction();

    const populatedSession = await populateSession(Session.findById(session._id));

    res.status(200).json({
      success: true,
      message: "Session completed successfully and skill points transferred",
      session: populatedSession
    });
  } catch (error) {
    await dbSession.abortTransaction();
    res.status(500).json({
      success: false,
      message: "Could not complete session",
      error: error.message
    });
  } finally {
    dbSession.endSession();
  }
};
