import axios from "axios";

const defaultSkills = ["DSA", "Aptitude", "English Speaking", "Resume Building", "Interview Preparation"];
const fallbackMentorQuestions = [
  "Which topic should I focus on first?",
  "Can you review my current preparation level?",
  "What should I practice after this 5-day plan?"
];
let skipHuggingFace = false;
let hasLoggedHuggingFaceSkip = false;

const isDevelopment = () => process.env.NODE_ENV !== "production";

const cleanEnvValue = (value) => {
  return String(value || "").trim().replace(/^["']|["']$/g, "");
};

const isNetworkError = (error) => {
  return ["ENOTFOUND", "EAI_AGAIN", "ECONNREFUSED", "ETIMEDOUT", "ECONNRESET"].includes(error.code);
};

const logHuggingFaceSkipOnce = (message) => {
  if (!isDevelopment() || hasLoggedHuggingFaceSkip) {
    return;
  }

  console.warn(message);
  hasLoggedHuggingFaceSkip = true;
};

const addUniqueSkills = (target, skills) => {
  skills.forEach((skill) => {
    if (!target.includes(skill)) {
      target.push(skill);
    }
  });
};

const hasKeyword = (text, keyword) => {
  const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(^|[^a-z0-9])${escapedKeyword}([^a-z0-9]|$)`, "i");
  return regex.test(text);
};

export const extractTextFromHFResponse = (data) => {
  if (!data) {
    return "";
  }

  if (typeof data === "string") {
    return data;
  }

  if (Array.isArray(data)) {
    const first = data[0];

    if (typeof first === "string") {
      return first;
    }

    return first?.generated_text || first?.summary_text || first?.text || "";
  }

  if (typeof data === "object") {
    if (data.error) {
      return "";
    }

    return data.generated_text || data.summary_text || data.text || "";
  }

  return "";
};

export const safeParseAiJson = (text) => {
  if (!text || typeof text !== "string") {
    return null;
  }

  const withoutFences = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(withoutFences);
  } catch {
    const firstBrace = withoutFences.indexOf("{");
    const lastBrace = withoutFences.lastIndexOf("}");

    if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
      return null;
    }

    const possibleJson = withoutFences.slice(firstBrace, lastBrace + 1);

    try {
      return JSON.parse(possibleJson);
    } catch {
      return null;
    }
  }
};

const buildPathFromPlainText = (text) => {
  const dayLines = String(text || "")
    .split(/\r?\n/)
    .map((line) => line.trim().replace(/^[-*]\s*/, ""))
    .filter((line) => /^day\s*[1-5]\s*:/i.test(line));

  if (dayLines.length < 5) {
    return null;
  }

  return {
    learningPath: dayLines.slice(0, 5),
    mentorQuestions: fallbackMentorQuestions
  };
};


export const extractSkillsRuleBased = (goalText) => {
  const text = goalText.toLowerCase();
  const skills = [];

  if (hasKeyword(text, "mern") || text.includes("mern stack") || text.includes("full stack mern")) {
    addUniqueSkills(skills, ["MongoDB", "Express.js", "React.js", "Node.js", "Full Stack Development"]);
  }

  if (text.includes("java full stack") || hasKeyword(text, "spring boot") || hasKeyword(text, "spring") || text.includes("rest api")) {
    addUniqueSkills(skills, ["Java", "Spring Boot", "REST API", "Database", "Full Stack Development"]);
  } else if (hasKeyword(text, "java") || text.includes("core java")) {
    addUniqueSkills(skills, ["Java"]);
  }

  // System Design
  if (text.includes("system design") || text.includes("architecture") || hasKeyword(text, "hld") || hasKeyword(text, "lld") || hasKeyword(text, "scalability")) {
    addUniqueSkills(skills, ["System Design", "Architecture"]);
  }

  // Data Science / ML — must come BEFORE DSA check to prevent "data structures" matching "data"
  if (
    text.includes("data science") ||
    text.includes("machine learning") ||
    text.includes("deep learning") ||
    text.includes("neural network") ||
    text.includes("natural language") ||
    hasKeyword(text, "ml") ||
    hasKeyword(text, "dl") ||
    hasKeyword(text, "nlp") ||
    hasKeyword(text, "tensorflow") ||
    hasKeyword(text, "pytorch") ||
    hasKeyword(text, "pandas") ||
    hasKeyword(text, "numpy") ||
    hasKeyword(text, "sklearn") ||
    hasKeyword(text, "matplotlib") ||
    (hasKeyword(text, "ai") && !text.includes("ai suggestions"))
  ) {
    addUniqueSkills(skills, ["Data Science", "Machine Learning", "Python"]);
  }

  if (text.includes("java full stack") || hasKeyword(text, "spring boot") || hasKeyword(text, "spring") || text.includes("rest api")) {
    addUniqueSkills(skills, ["Java", "Spring Boot", "REST API", "Database", "Full Stack Development"]);
  } else if (hasKeyword(text, "java") || text.includes("core java")) {
    addUniqueSkills(skills, ["Java"]);
  }

  if (hasKeyword(text, "dp") || text.includes("dynamic programming") || hasKeyword(text, "memoization") || hasKeyword(text, "tabulation")) {
    addUniqueSkills(skills, ["Dynamic Programming"]);
  }

  if (hasKeyword(text, "recursion") || hasKeyword(text, "recursive")) {
    addUniqueSkills(skills, ["Recursion"]);
  }

  if (hasKeyword(text, "dsa") || text.includes("data structures") || hasKeyword(text, "algorithms") || text.includes("coding problems") || text.includes("problem solving")) {
    addUniqueSkills(skills, ["DSA", "Data Structures", "Algorithms", "Problem Solving"]);
  }

  if (hasKeyword(text, "placement") || hasKeyword(text, "placements")) {
    addUniqueSkills(skills, ["DSA", "Placement Preparation"]);
  }

  if (hasKeyword(text, "backtracking")) {
    addUniqueSkills(skills, ["Backtracking"]);
  }

  if (hasKeyword(text, "frontend") || text.includes("front end") || hasKeyword(text, "react") || hasKeyword(text, "html") || hasKeyword(text, "css") || hasKeyword(text, "javascript")) {
    addUniqueSkills(skills, ["HTML", "CSS", "JavaScript", "React.js"]);
  }

  if (hasKeyword(text, "backend") || text.includes("back end") || hasKeyword(text, "node") || hasKeyword(text, "nodejs") || hasKeyword(text, "express") || hasKeyword(text, "api")) {
    addUniqueSkills(skills, ["Node.js", "Express.js", "REST API"]);
  }

  const hasCsFundamentals = hasKeyword(text, "os") || text.includes("operating system") || hasKeyword(text, "cn") || text.includes("computer networks");

  if (hasCsFundamentals || hasKeyword(text, "oops")) {
    addUniqueSkills(skills, ["Operating System", "DBMS", "Computer Networks", "CS Fundamentals"]);
  } else if (hasKeyword(text, "database") || hasKeyword(text, "dbms") || hasKeyword(text, "sql") || hasKeyword(text, "mysql") || hasKeyword(text, "mongodb")) {
    addUniqueSkills(skills, ["DBMS", "SQL", "MongoDB"]);
  }

  if (hasKeyword(text, "aptitude") || hasKeyword(text, "quantitative") || hasKeyword(text, "reasoning") || hasKeyword(text, "verbal")) {
    addUniqueSkills(skills, ["Aptitude", "Quantitative Aptitude", "Reasoning"]);
  }

  if (hasKeyword(text, "english") || hasKeyword(text, "communication") || hasKeyword(text, "speaking") || text.includes("interview english") || hasKeyword(text, "fluency")) {
    addUniqueSkills(skills, ["English Speaking", "Communication Skills"]);
  }

  if (hasKeyword(text, "resume") || hasKeyword(text, "cv")) {
    addUniqueSkills(skills, ["Resume Building"]);
  }

  if (hasKeyword(text, "interview") || hasKeyword(text, "hr") || text.includes("technical interview") || text.includes("mock interview")) {
    addUniqueSkills(skills, ["Interview Preparation", "HR Interview"]);

    if (text.includes("technical interview")) {
      addUniqueSkills(skills, ["Technical Interview"]);
    }
  }

  if (hasKeyword(text, "git") || hasKeyword(text, "github")) {
    addUniqueSkills(skills, ["Git", "GitHub"]);
  }

  return skills;
};

export const generateFallbackLearningPath = (extractedSkills) => {
  const has = (skill) => extractedSkills.includes(skill);
  const isDefaultSkillSet =
    extractedSkills.length === defaultSkills.length &&
    defaultSkills.every((skill) => extractedSkills.includes(skill));

  if (isDefaultSkillSet) {
    return [
      "Day 1: Understand target skills and list weak areas.",
      "Day 2: Study core concepts with short notes and examples.",
      "Day 3: Practice beginner problems and review mistakes.",
      "Day 4: Solve placement-style questions with timed practice.",
      "Day 5: Revise, take a mock test, and plan next steps with a mentor."
    ];
  }

  if (has("Data Science") || has("Machine Learning")) {
    return [
      "Day 1: Set up Python environment; learn NumPy and Pandas basics with a dataset.",
      "Day 2: Learn data cleaning, EDA, and visualization with Matplotlib and Seaborn.",
      "Day 3: Understand supervised learning — linear regression, logistic regression, decision trees.",
      "Day 4: Practice model evaluation (accuracy, precision, recall) and try scikit-learn pipelines.",
      "Day 5: Build a small end-to-end ML project and review findings with a mentor."
    ];
  }

  if (has("MongoDB") && has("Express.js") && has("React.js") && has("Node.js")) {
    return [
      "Day 1: Learn MongoDB basics, collections, schemas, and CRUD operations.",
      "Day 2: Learn Express.js routing, controllers, middleware, and REST APIs.",
      "Day 3: Learn React components, props, state, forms, and routing.",
      "Day 4: Connect React with Express APIs and add JWT authentication.",
      "Day 5: Build a small MERN feature and review it with a mentor."
    ];
  }

  if (has("DSA") || has("Data Structures") || has("Algorithms")) {
    if (has("Dynamic Programming")) {
      return [
        "Day 1: Revise recursion fundamentals and practice simple recursive problems.",
        "Day 2: Learn memoization (top-down DP) and solve 3 basic DP problems.",
        "Day 3: Practice 1D DP patterns — climbing stairs, house robber, coin change.",
        "Day 4: Practice 2D DP — grid paths, longest common subsequence, 0/1 knapsack.",
        "Day 5: Take a timed DP mock test and review weak areas with a mentor."
      ];
    }

    return [
      "Day 1: Revise arrays, strings, and basic time/space complexity (Big-O).",
      "Day 2: Practice linked lists, stacks, and queues with 5 problems each.",
      "Day 3: Study trees (binary trees, BST) and practice traversals + problems.",
      "Day 4: Study sorting algorithms, binary search, and two-pointer techniques.",
      "Day 5: Attempt a mixed placement-style DSA mock test and discuss with a mentor."
    ];
  }

  if (has("Dynamic Programming") || has("Recursion")) {
    return [
      "Day 1: Revise recursion basics and dry run simple recursive problems.",
      "Day 2: Learn memoization and solve basic DP problems.",
      "Day 3: Practice 1D DP patterns like climbing stairs and house robber.",
      "Day 4: Practice 2D DP patterns like grid paths and knapsack basics.",
      "Day 5: Take a timed placement-style DP practice session with mentor guidance."
    ];
  }

  if (has("English Speaking") || has("Communication Skills")) {
    return [
      "Day 1: Prepare self-introduction and speak for 1 minute.",
      "Day 2: Practice common HR questions with simple English.",
      "Day 3: Practice explaining one project clearly.",
      "Day 4: Practice mock interview answers and reduce filler words.",
      "Day 5: Record and review a mock interview with mentor feedback."
    ];
  }

  if (has("Operating System") || has("DBMS") || has("Computer Networks")) {
    return [
      "Day 1: Revise OS basics: process, thread, scheduling, and deadlock.",
      "Day 2: Revise DBMS basics: keys, normalization, SQL joins, and transactions.",
      "Day 3: Revise CN basics: OSI model, TCP/IP, HTTP, DNS, and routing.",
      "Day 4: Practice common interview questions from OS, DBMS, and CN.",
      "Day 5: Take a CS fundamentals mock interview with a mentor."
    ];
  }

  return [
    "Day 1: Understand target skills and list weak areas.",
    "Day 2: Study core concepts with short notes and examples.",
    "Day 3: Practice beginner problems and review mistakes.",
    "Day 4: Solve placement-style questions with timed practice.",
    "Day 5: Revise, take a mock test, and plan next steps with a mentor."
  ];
};

export const generateFallbackMentorQuestions = () => fallbackMentorQuestions;

export const generateAIEnhancedPath = async (goalText, extractedSkills) => {
  const fallback = {
    learningPath: generateFallbackLearningPath(extractedSkills),
    mentorQuestions: generateFallbackMentorQuestions(),
    usedFallback: true,
    rawAiResponse: "",
    aiError: ""
  };

  const HF_API_KEY = cleanEnvValue(process.env.HF_API_KEY);
  const HF_MODEL = cleanEnvValue(process.env.HF_MODEL) || "openai/gpt-oss-20b:fireworks-ai";

  if (skipHuggingFace) {
    return fallback;
  }

  if (!cleanEnvValue(process.env.HF_MODEL) && isDevelopment()) {
    console.log("HF_MODEL missing, using default: openai/gpt-oss-20b:fireworks-ai");
  }

  if (!HF_API_KEY) {
    console.log("HF_API_KEY is missing");
    return fallback;
  }

  const prompt = `You are a learning advisor for a student skill exchange platform called SkillBridge.

Student goal:
"${goalText}"

Extracted skills:
${extractedSkills.join(", ")}

Create a practical 5-day learning path and 3 mentor questions.

Return ONLY valid JSON.
Do not use markdown.
Do not add explanation.

Format:
{
  "learningPath": [
    "Day 1: ...",
    "Day 2: ...",
    "Day 3: ...",
    "Day 4: ...",
    "Day 5: ..."
  ],
  "mentorQuestions": [
    "...",
    "...",
    "..."
  ]
}`;

  try {
    if (isDevelopment()) {
      console.log("HF_MODEL:", HF_MODEL);
    }

    const response = await axios.post(
      "https://router.huggingface.co/v1/chat/completions",
      {
        model: HF_MODEL,
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 800,
        temperature: 0.2
      },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json"
        },
        timeout: 40000
      }
    );

    if (isDevelopment()) {
      console.log("HF status:", response.status);
      console.log("HF raw response:", JSON.stringify(response.data).slice(0, 500));
    }

    const generatedText = response.data?.choices?.[0]?.message?.content || extractTextFromHFResponse(response.data);
    const parsed = safeParseAiJson(generatedText) || buildPathFromPlainText(generatedText);

    if (!parsed || !Array.isArray(parsed.learningPath) || !Array.isArray(parsed.mentorQuestions)) {
      return {
        ...fallback,
        rawAiResponse: generatedText,
        aiError: "Hugging Face response could not be parsed as valid JSON"
      };
    }

    if (parsed.learningPath.length !== 5) {
      return {
        ...fallback,
        rawAiResponse: generatedText,
        aiError: "Hugging Face learningPath did not contain exactly 5 days"
      };
    }

    return {
      learningPath: parsed.learningPath,
      mentorQuestions: parsed.mentorQuestions.slice(0, 3),
      usedFallback: false,
      rawAiResponse: generatedText,
      aiError: ""
    };
  } catch (error) {
    if (isNetworkError(error)) {
      skipHuggingFace = true;
      logHuggingFaceSkipOnce(
        `Hugging Face API cannot be reached (${error.message}). Using local recommendations until the backend restarts.`
      );
    } else if (isDevelopment()) {
      console.error("HF error status:", error.response?.status);
      console.error("HF error data:", error.response?.data);
      console.error("HF error message:", error.message);
    }

    return {
      ...fallback,
      aiError: error.message
    };
  }
};
