import MentorProfile from "../models/MentorProfile.js";
import RecommendationLog from "../models/RecommendationLog.js";
import {
  extractSkillsRuleBased,
  generateAIEnhancedPath
} from "../services/huggingFaceService.js";

import { allSkillGroups as skillAliasGroups } from "../config/skills.js";

const userFields = "name email branch year skillsKnown";

/** Build lookup: normalizedSkill → Set<string> of all aliases in its group */
const buildAliasLookup = () => {
  const lookup = new Map();
  for (const group of skillAliasGroups) {
    const groupSet = new Set(group);
    for (const alias of group) {
      lookup.set(alias, groupSet);
    }
  }
  return lookup;
};

const aliasLookup = buildAliasLookup();

/** Strip everything except lowercase a-z and 0-9 */
const normalizeSkill = (skill) =>
  String(skill || "").toLowerCase().replace(/[^a-z0-9]/g, "");

/** Get the alias Set for a skill; falls back to a singleton of itself */
const getAliasSet = (skill) => {
  const n = normalizeSkill(skill);
  return aliasLookup.get(n) || new Set([n]);
};

/**
 * Build a Set of ALL normalized aliases for all extracted skills.
 * This is the "query fingerprint" we compare against mentor skills.
 */
const buildQueryAliasUnion = (extractedSkills) => {
  const union = new Set();
  for (const skill of extractedSkills) {
    for (const alias of getAliasSet(skill)) {
      union.add(alias);
    }
    // Also add the raw normalized skill so direct string matches work
    union.add(normalizeSkill(skill));
  }
  return union;
};

/**
 * Score a mentor against the query alias union.
 * Each distinct matched skill group contributes 1 point.
 * Returns 0 if no match — those mentors are excluded.
 */
const scoreMentor = (mentorSkills, queryAliasUnion) => {
  if (!mentorSkills?.length) return 0;

  // Track which query-skill groups have already been counted
  // to avoid double-scoring the same group twice
  const matchedQueryGroups = new Set();

  for (const mentorSkill of mentorSkills) {
    const mNorm = normalizeSkill(mentorSkill);
    // Direct hit against any alias in the query union
    if (queryAliasUnion.has(mNorm)) {
      // Find which query group this belongs to and mark it
      const group = aliasLookup.get(mNorm);
      const groupKey = group ? [...group].sort().join("|") : mNorm;
      if (!matchedQueryGroups.has(groupKey)) {
        matchedQueryGroups.add(groupKey);
      }
    }
  }

  return matchedQueryGroups.size;
};

const findMatchingMentors = async (extractedSkills) => {
  // Fetch ALL verified mentors — filtering is done in JS for flexibility
  const mentors = await MentorProfile.find({ isVerified: true })
    .populate("userId", userFields)
    .sort({ rating: -1, totalReviews: -1, createdAt: -1 })
    .lean();

  const queryAliasUnion = buildQueryAliasUnion(extractedSkills);

  const scored = mentors
    .map((mentor) => ({
      ...mentor,
      matchScore: scoreMentor(mentor.skills || [], queryAliasUnion),
      skillMatchCount: scoreMentor(mentor.skills || [], queryAliasUnion)
    }))
    .filter((m) => m.matchScore > 0)
    .sort((a, b) => {
      if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore;
      if ((b.rating || 0) !== (a.rating || 0)) return (b.rating || 0) - (a.rating || 0);
      return (b.totalReviews || 0) - (a.totalReviews || 0);
    });

  return scored.slice(0, 5);
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
