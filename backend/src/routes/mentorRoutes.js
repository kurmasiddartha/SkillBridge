import express from "express";
import {
  createMentorProfile,
  getMentorById,
  getMentors,
  getMyMentorProfile,
  searchMentors,
  updateMentorProfile
} from "../controllers/mentorController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/profile", protect, createMentorProfile);
router.get("/my-profile", protect, getMyMentorProfile);
router.put("/profile", protect, updateMentorProfile);
router.get("/search", searchMentors);
router.get("/", getMentors);
router.get("/:id", getMentorById);

export default router;
