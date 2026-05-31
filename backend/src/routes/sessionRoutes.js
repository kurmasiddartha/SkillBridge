import express from "express";
import {
  acceptSession,
  bookSession,
  cancelSession,
  completeSession,
  getMentorSessions,
  getMySessions,
  rejectSession
} from "../controllers/sessionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/book", protect, bookSession);
router.get("/my", protect, getMySessions);
router.get("/mentor", protect, getMentorSessions);
router.put("/:id/accept", protect, acceptSession);
router.put("/:id/reject", protect, rejectSession);
router.put("/:id/cancel", protect, cancelSession);
router.put("/:id/complete", protect, completeSession);

export default router;
