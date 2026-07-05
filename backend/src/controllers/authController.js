import jwt from "jsonwebtoken";
import User from "../models/User.js";

const createToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });
};

const formatUser = (user) => {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    branch: user.branch,
    year: user.year,
    skillsKnown: user.skillsKnown,
    skillsWanted: user.skillsWanted,
    skillPoints: user.skillPoints,
    role: user.role,
    isMentor: user.isMentor,
    createdAt: user.createdAt
  };
};

export const register = async (req, res) => {
  try {
    const { name, email, password, branch, year, skillsKnown, skillsWanted } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required"
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered"
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      branch,
      year,
      skillsKnown,
      skillsWanted
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token: createToken(user._id),
      user: formatUser(user)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      token: createToken(user._id),
      user: formatUser(user)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message
    });
  }
};

export const getMe = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user: formatUser(req.user)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Could not fetch user profile",
      error: error.message
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const allowedFields = ["name", "branch", "year", "skillsKnown", "skillsWanted"];
    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (!Object.keys(updates).length) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided to update"
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: formatUser(user)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Could not update profile",
      error: error.message
    });
  }
};

