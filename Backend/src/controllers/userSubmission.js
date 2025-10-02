const Problem = require("../models/problem");
const submission = require("../models/submission.model");
const User = require("../models/user.model");
const { updateSprintProgress } = require("./sprint.controller");
const {
  getLanguageById,
  submitBatch,
  submitToken,
} = require("../utils/problemUtility");

// Helper function to calculate points based on difficulty
const calculatePoints = (difficulty) => {
  const pointsMap = {
    easy: 10,
    medium: 25,
    hard: 50,
    Easy: 10,
    Medium: 25,
    Hard: 50,
  };
  return pointsMap[difficulty] || 10;
};

// Helper function to update user streaks
const updateStreaks = async (userId) => {
  const user = await User.findById(userId);
  const today = new Date();
  const lastUpdated = new Date(user.streaks.lastUpdated);

  // Check if it's a new day
  const isNewDay = today.toDateString() !== lastUpdated.toDateString();

  if (isNewDay) {
    // Check if user solved a problem yesterday (consecutive day)
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // For simplicity, we'll increment streak if it's a new day
    // In a real implementation, you'd check if user solved problems yesterday
    user.streaks.current += 1;
    user.streaks.longest = Math.max(user.streaks.longest, user.streaks.current);
    user.streaks.lastUpdated = today;
  }

  await user.save();
};

const submitCode = async (req, res) => {
  try {
    const userId = req.result._id;
    const problemId = req.params.id;

    let { code, language } = req.body;

    if (!userId || !problemId || !code || !language) {
      return res.status(404).send("Some fields are missing");
    }

    if (language === "cpp") {
      language = "c++";
    }

    // Code submitted by user

    // Fetch the problem from database for hiddentestcases
    const problem = await Problem.findById(problemId);

    // Store the submitted code before judge 0, some times judgde 0 may not written the result but we need show user the pending status
    const submittedResult = await submission.create({
      userId,
      problemId,
      code,
      language,
      status: "pending",
      testCasesTotal: problem.hiddenTestCases.length,
    });

    // Lets submit the code in judge 0
    const languageId = getLanguageById(language);
    if (!language) {
      return res.status(404).send(`Unsupported language: ${language}`);
    }
    // The submisssions should be array of objects as we saw in docs
    const submissions = problem.hiddenTestCases.map((testcase) => ({
      source_code: code,
      language_id: languageId,
      stdin: testcase.input,
      expected_output: testcase.output,
    }));

    const submitResult = await submitBatch(submissions);
    if (!submitResult || !Array.isArray(submitResult)) {
      return res.status(500).send("submitBatch did not return a valid array.");
    }

    const resultToken = submitResult.map((value) => value.token);

    const testResult = await submitToken(resultToken);

    let testCasesPassed = 0;
    let runtime = 0;
    let memory = 0;
    let status = "accepted";
    let errorMessage = null;

    for (const test of testResult) {
      if (test.status_id == 3) {
        testCasesPassed++;
        runtime = runtime + parseFloat(test.time);
        memory = Math.max(memory, test.memory);
      } else {
        if (test.status_id == 4) {
          status = "error";
          errorMessage = test.stderr;
        } else {
          status = "wrong";
          errorMessage = test.stderr;
        }
      }
    }

    // Store the result in Database in Submission
    submittedResult.status = status;
    submittedResult.testCasesPassed = testCasesPassed;
    submittedResult.errorMessage = errorMessage;
    submittedResult.runtime = runtime;
    submittedResult.memory = memory;

    await submittedResult.save();

    // req.result == user Information
    if (!Array.isArray(req.result.problemSolved)) {
      req.result.problemSolved = [];
    }

    const accepted = status == "accepted";

    // Update leaderboard data if problem is solved
    if (accepted && !req.result.problemSolved.includes(problemId)) {
      // Add to solved problems
      req.result.problemSolved.push(problemId);

      // Award points based on difficulty
      const pointsToAward = calculatePoints(problem.difficulty);
      req.result.points += pointsToAward;

      // Update checkedProblems array
      const existingCheckedProblem = req.result.checkedProblems.find(
        (cp) => cp.pid.toString() === problemId
      );

      if (existingCheckedProblem) {
        existingCheckedProblem.isSolved = true;
        existingCheckedProblem.submitDate = new Date();
      } else {
        req.result.checkedProblems.push({
          pid: problemId,
          isSolved: true,
          submitDate: new Date(),
        });
      }

      // Update streaks
      await updateStreaks(userId);

      // Update sprint progress
      await updateSprintProgress(userId, problemId);

      await req.result.save();
    } else if (!accepted) {
      // Add to checkedProblems as attempted (not solved)
      const existingCheckedProblem = req.result.checkedProblems.find(
        (cp) => cp.pid.toString() === problemId
      );

      if (!existingCheckedProblem) {
        req.result.checkedProblems.push({
          pid: problemId,
          isSolved: false,
          submitDate: new Date(),
        });
        await req.result.save();
      }
    }

    res.status(201).json({
      accepted,
      totalTestCases: submittedResult.testCasesTotal,
      passedTestCases: testCasesPassed,
      runtime,
      memory,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const runCode = async (req, res) => {
  try {
    const userId = req.result._id;
    const problemId = req.params.id;

    let { code, language } = req.body;

    if (!userId || !problemId || !code || !language) {
      return res.status(404).send("Some fields are missing");
    }

    if (language === "cpp") {
      language = "c++";
    }

    // Code written by user

    // Fetch the problem from database for hiddentestcases
    const problem = await Problem.findById(problemId);

    // We dont need to store the submission for runCode

    // Lets submit the code in judge 0
    const languageId = getLanguageById(language);
    if (!language) {
      return res.status(404).send(`Unsupported language: ${language}`);
    }
    // The submisssions should be array of objects as we saw in docs
    const submissions = problem.visibleTestCases.map((testcase) => ({
      source_code: code,
      language_id: languageId,
      stdin: testcase.input,
      expected_output: testcase.output,
    }));

    const submitResult = await submitBatch(submissions);
    if (!submitResult || !Array.isArray(submitResult)) {
      return res.status(500).send("submitBatch did not return a valid array.");
    }

    const resultToken = submitResult.map((value) => value.token);

    const testResult = await submitToken(resultToken);
    const InformationToSend = testResult.map((test, index) => ({
      input: test.stdin || problem.visibleTestCases[index]?.input || "",
      expected:
        test.expected_output || problem.visibleTestCases[index]?.output || "",
      output: test.stdout
        ? test.stdout.trim()
        : test.stderr
        ? test.stderr.trim()
        : "",
      status: test.status?.description || "Unknown",
      passed: test.status_id === 3, // 3 means accepted in Judge0
      error: test.stderr ? test.stderr.trim() : null,
      time: test.time || "0",
      memory: test.memory || "0",
    }));

    return res.status(200).json(InformationToSend);
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { submitCode, runCode };
