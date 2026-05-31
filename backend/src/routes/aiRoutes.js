import express from "express";
import { recommendMentors } from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/recommend", protect, recommendMentors);

export default router;
