import MentorProfile from "../models/MentorProfile.js";
import RecommendationLog from "../models/RecommendationLog.js";
import {
  extractSkillsRuleBased,
  generateAIEnhancedPath
} from "../services/huggingFaceService.js";

const userFields = "name email branch year skillsKnown";

const skillAliasMap = {
  mongodb: ["mongodb", "mongo"],
  mongo: ["mongodb", "mongo"],
  expressjs: ["expressjs", "express", "express.js"],
  express: ["expressjs", "express", "express.js"],
  reactjs: ["reactjs", "react", "react.js"],
  react: ["reactjs", "react", "react.js"],
  nodejs: ["nodejs", "node", "node.js"],
  node: ["nodejs", "node", "node.js"],
  dynamicprogramming: ["dynamicprogramming", "dp"],
  dp: ["dynamicprogramming", "dp"],
  recursion: ["recursion", "recursive"],
  dsa: ["dsa", "datastructures", "algorithms", "problemsolving"],
  datastructures: ["dsa", "datastructures", "algorithms"],
  operatingsystem: ["operatingsystem", "operatingsystems", "os"],
  os: ["operatingsystem", "operatingsystems", "os"],
  dbms: ["dbms", "database", "sql"],
  computernetworks: ["computernetworks", "cn", "networking"],
  cn: ["computernetworks", "cn", "networking"],
  csfundamentals: ["csfundamentals", "operatingsystem", "dbms", "computernetworks", "os", "cn"],
  springboot: ["springboot", "spring"],
  restapi: ["restapi", "api"],
  fullstackdevelopment: ["fullstackdevelopment", "fullstack", "mern", "javafullstack"],
  englishspeaking: ["englishspeaking", "english", "communication", "fluency"],
  communicationskills: ["communicationskills", "communication", "speaking"],
  interviewpreparation: ["interviewpreparation", "interview", "mockinterview"],
  hrinterview: ["hrinterview", "hr"],
  placementpreparation: ["placementpreparation", "placement", "placements"]
};

const normalizeSkill = (skill) => {
  return String(skill || "").toLowerCase().replace(/[^a-z0-9]/g, "");
};

const expandSkill = (skill) => {
  const normalizedSkill = normalizeSkill(skill);
  return skillAliasMap[normalizedSkill] || [normalizedSkill];
};

const calculateMatchScore = (mentorSkills, extractedSkills) => {
  const mentorAliases = mentorSkills.flatMap(expandSkill);
  const extractedAliases = extractedSkills.flatMap(expandSkill);
  let score = 0;

  extractedAliases.forEach((skill) => {
    if (mentorAliases.includes(skill)) {
      score += 2;
      return;
    }

    if (mentorAliases.some((mentorSkill) => mentorSkill.includes(skill) || skill.includes(mentorSkill))) {
      score += 1;
    }
  });

  return score;
};

const findMatchingMentors = async (extractedSkills) => {
  const mentors = await MentorProfile.find({ isVerified: true })
    .populate("userId", userFields)
    .sort({ rating: -1, totalReviews: -1, createdAt: -1 });

  return mentors
    .map((mentor) => {
      const mentorObject = mentor.toObject();
      const matchScore = calculateMatchScore(mentor.skills || [], extractedSkills);

      return {
        ...mentorObject,
        matchScore,
        skillMatchCount: matchScore
      };
    })
    .filter((mentor) => mentor.matchScore > 0)
    .sort((a, b) => {
      if (b.matchScore !== a.matchScore) {
        return b.matchScore - a.matchScore;
      }

      if ((b.rating || 0) !== (a.rating || 0)) {
        return (b.rating || 0) - (a.rating || 0);
      }

      return (b.totalReviews || 0) - (a.totalReviews || 0);
    })
    .slice(0, 5);
};

export const recommendMentors = async (req, res) => {
  try {
    const { goalText } = req.body;

    if (!goalText) {
      return res.status(400).json({
        success: false,
        message: "goalText is required"
      });
    }

    const extractedSkills = extractSkillsRuleBased(goalText);
    const aiResult = await generateAIEnhancedPath(goalText, extractedSkills);
    const recommendedMentors = await findMatchingMentors(extractedSkills);

    await RecommendationLog.create({
      userId: req.user._id,
      goalText,
      extractedSkills,
      learningPath: aiResult.learningPath,
      mentorQuestions: aiResult.mentorQuestions,
      recommendedMentors,
      usedFallback: aiResult.usedFallback,
      rawAiResponse: aiResult.rawAiResponse
    });

    res.status(200).json({
      success: true,
      message: "Recommendations generated successfully",
      data: {
        goalText,
        extractedSkills,
        learningPath: aiResult.learningPath,
        mentorQuestions: aiResult.mentorQuestions,
        recommendedMentors,
        usedFallback: aiResult.usedFallback,
        ...(process.env.NODE_ENV !== "production" && aiResult.aiError
          ? { aiError: aiResult.aiError }
          : {})
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Could not generate AI recommendation",
      error: error.message
    });
  }
};
