export const technicalSkillGroups = [
  // MERN / Full Stack
  ["mern", "mernstack", "fullstack", "fullstackdevelopment", "fullstackweb"],
  ["mongodb", "mongo"],
  ["expressjs", "express"],
  ["reactjs", "react"],
  ["nodejs", "node"],

  // Java stack
  ["java", "corejava", "javabasics"],
  ["springboot", "spring", "springframework"],
  ["restapi", "api", "webapi"],
  ["javafullstack", "javabackend"],

  // DSA
  ["dsa", "datastructures", "datastructuresandalgorithms", "algorithms", "problemsolving", "codingproblems", "competitiveprogramming", "cp"],
  ["dynamicprogramming", "dp", "memoization", "tabulation"],
  ["recursion", "recursive"],
  ["backtracking"],
  ["graphs", "graph", "graphtheory"],
  ["trees", "tree", "binarytree", "binarysearchtree", "bst"],
  ["sorting", "searching", "binarysearch"],

  // System Design
  ["systemdesign", "architecture", "hld", "lld", "scalability", "softwarearchitecture"],

  // Data Science / ML / AI
  ["datascience", "ds", "datasci", "dataanalysis", "dataanalytics"],
  ["machinelearning", "ml", "supervisedlearning", "unsupervisedlearning"],
  ["deeplearning", "dl", "neuralnetworks", "neuralnetwork", "nn"],
  ["artificialintelligence", "ai"],
  ["nlp", "naturallanguageprocessing", "naturallanguage"],
  ["computervision", "cv", "imageprocessing"],
  ["python", "py"],
  ["pandas", "numpy", "matplotlib", "seaborn", "scipy"],
  ["sklearn", "scikitlearn", "scikit"],
  ["tensorflow", "tf", "keras"],
  ["pytorch", "torch"],

  // Frontend
  ["html", "html5"],
  ["css", "css3"],
  ["javascript", "js", "es6"],
  ["typescript", "ts"],
  ["vuejs", "vue"],
  ["angularjs", "angular"],
  ["nextjs", "next"],

  // Backend / DB
  ["dbms", "database", "sql", "mysql", "rdbms", "relational"],
  ["postgresql", "postgres"],
  ["redis"],

  // CS Fundamentals
  ["operatingsystem", "operatingsystems", "os"],
  ["computernetworks", "cn", "networking"],
  ["oops", "objectoriented", "oop"],

  // Cloud / DevOps
  ["git", "github", "versioncontrol"],
  ["docker", "containers"],
  ["kubernetes", "k8s"],
  ["aws", "amazon", "amazonwebservices"],
  ["azure", "microsoftazure"],
  ["gcp", "googlecloud"],
  ["cloud", "cloudcomputing"]
];

export const nonTechnicalSkillGroups = [
  ["aptitude", "quantitativeaptitude", "quantitative", "reasoning", "verbal", "logicalreasoning"],
  ["englishspeaking", "english", "communication", "communicationskills", "fluency", "speaking", "softskills"],
  ["resume", "resumebuilding", "cv"],
  ["interviewpreparation", "interview", "mockinterview", "technicalinterview", "interview prep"],
  ["hrinterview", "hr"],
  ["placementpreparation", "placement", "placements", "campusplacement"]
];

export const allSkillGroups = [...technicalSkillGroups, ...nonTechnicalSkillGroups];
