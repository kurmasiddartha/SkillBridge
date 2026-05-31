import express from "express";
import { getMentorDashboard, getStudentDashboard } from "../controllers/dashboardController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/student", protect, getStudentDashboard);
router.get("/mentor", protect, getMentorDashboard);

export default router;
