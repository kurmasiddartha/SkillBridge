import express from "express";
import { createReview, getMentorReviews } from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createReview);
router.get("/mentor/:mentorProfileId", getMentorReviews);

export default router;
