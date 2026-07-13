import express from "express";
import cors from "cors";
import adminRoutes from "./routes/adminRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import mentorRoutes from "./routes/mentorRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";

const app = express();

// Configure CORS for deployment
app.use(cors({
  origin: function (origin, callback) {
    callback(null, true);
  },
  credentials: true
}));

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "SkillBridge backend is running"
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/mentors", mentorRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/dashboard", dashboardRoutes);

export default app;
