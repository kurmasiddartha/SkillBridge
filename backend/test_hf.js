import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import {
  extractSkillsRuleBased,
  generateAIEnhancedPath
} from "./src/services/huggingFaceService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "./.env") });

const goalText = "mern";
const extractedSkills = extractSkillsRuleBased(goalText);

console.log("Running Hugging Face router API test...");
console.log("API key loaded:", Boolean(process.env.HF_API_KEY));
console.log("Model:", process.env.HF_MODEL || "google/flan-t5-base");
console.log("Extracted skills:", extractedSkills);

const result = await generateAIEnhancedPath(goalText, extractedSkills);

console.log("Used fallback:", result.usedFallback);
console.log("Learning path:", result.learningPath);
console.log("Mentor questions:", result.mentorQuestions);
if (result.aiError) {
  console.log("AI error:", result.aiError);
}
