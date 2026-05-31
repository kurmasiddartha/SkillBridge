import MentorProfile from "../models/MentorProfile.js";
import User from "../models/User.js";

const userPublicFields = "name email branch year skillsKnown skillsWanted skillPoints role isMentor createdAt";
const searchUserFields = "name email branch year skillsKnown";

export const createMentorProfile = async (req, res) => {
  try {
    if (req.user.role !== "STUDENT") {
      return res.status(403).json({
        success: false,
        message: "Only students can create mentor profiles"
      });
    }

    const existingProfile = await MentorProfile.findOne({ userId: req.user._id });

    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: "You already have a mentor profile"
      });
    }

    const { bio, skills, experienceLevel, availableSlots, mode, location } = req.body;

    if (!bio || !skills?.length || !experienceLevel || !mode) {
      return res.status(400).json({
        success: false,
        message: "Bio, skills, experience level, and mode are required"
      });
    }

    const mentorProfile = await MentorProfile.create({
      userId: req.user._id,
      bio,
      skills,
      experienceLevel,
      availableSlots,
      mode,
      location
    });

    await User.findByIdAndUpdate(req.user._id, { isMentor: true });

    const populatedProfile = await MentorProfile.findById(mentorProfile._id).populate(
      "userId",
      userPublicFields
    );

    res.status(201).json({
      success: true,
      message: "Mentor profile created successfully. It is pending admin verification.",
      mentorProfile: populatedProfile
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Could not create mentor profile",
      error: error.message
    });
  }
};

export const getMyMentorProfile = async (req, res) => {
  try {
    const mentorProfile = await MentorProfile.findOne({ userId: req.user._id }).populate(
      "userId",
      userPublicFields
    );

    if (!mentorProfile) {
      return res.status(404).json({
        success: false,
        message: "Mentor profile not found"
      });
    }

    res.status(200).json({
      success: true,
      mentorProfile
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Could not fetch mentor profile",
      error: error.message
    });
  }
};

export const updateMentorProfile = async (req, res) => {
  try {
    const allowedFields = ["bio", "skills", "experienceLevel", "availableSlots", "mode", "location"];
    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const mentorProfile = await MentorProfile.findOneAndUpdate(
      { userId: req.user._id },
      updates,
      { new: true, runValidators: true }
    ).populate("userId", userPublicFields);

    if (!mentorProfile) {
      return res.status(404).json({
        success: false,
        message: "Mentor profile not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Mentor profile updated successfully",
      mentorProfile
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Could not update mentor profile",
      error: error.message
    });
  }
};

export const getMentors = async (req, res) => {
  try {
    const { skill, mode, minRating, day } = req.query;
    const filter = { isVerified: true };

    if (skill) {
      filter.skills = { $regex: skill, $options: "i" };
    }

    if (mode) {
      filter.mode = mode === "Both" ? "Both" : { $in: [mode, "Both"] };
    }

    if (minRating) {
      filter.rating = { $gte: Number(minRating) };
    }

    if (day) {
      filter["availableSlots.day"] = { $regex: day, $options: "i" };
    }

    const mentors = await MentorProfile.find(filter)
      .populate("userId", userPublicFields)
      .sort({ rating: -1, totalReviews: -1, createdAt: -1 });

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

export const searchMentors = async (req, res) => {
  try {
    const { skill, mode, experienceLevel, minRating, keyword } = req.query;
    const filter = { isVerified: true };

    if (skill) {
      filter.skills = { $regex: skill, $options: "i" };
    }

    if (mode) {
      filter.mode = mode === "Both" ? "Both" : { $in: [mode, "Both"] };
    }

    if (experienceLevel) {
      filter.experienceLevel = experienceLevel;
    }

    if (minRating) {
      filter.rating = { $gte: Number(minRating) };
    }

    if (keyword) {
      filter.$or = [
        { bio: { $regex: keyword, $options: "i" } },
        { skills: { $regex: keyword, $options: "i" } }
      ];
    }

    const mentors = await MentorProfile.find(filter)
      .populate("userId", searchUserFields)
      .sort({ rating: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: mentors.length,
      mentors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Could not search mentors",
      error: error.message
    });
  }
};

export const getMentorById = async (req, res) => {
  try {
    const mentorProfile = await MentorProfile.findOne({
      _id: req.params.id,
      isVerified: true
    }).populate("userId", userPublicFields);

    if (!mentorProfile) {
      return res.status(404).json({
        success: false,
        message: "Verified mentor profile not found"
      });
    }

    res.status(200).json({
      success: true,
      mentorProfile
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Could not fetch mentor profile",
      error: error.message
    });
  }
};
