import express from "express";
import {
  deleteUser,
  getAdminDashboard,
  getAdminMentors,
  getAdminUsers,
  rejectMentor,
  verifyMentor
} from "../controllers/adminController.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, adminOnly);

router.get("/dashboard", getAdminDashboard);
router.get("/users", getAdminUsers);
router.get("/mentors", getAdminMentors);
router.put("/mentors/:id/verify", verifyMentor);
router.put("/mentors/:id/reject", rejectMentor);
router.delete("/users/:id", deleteUser);

export default router;
