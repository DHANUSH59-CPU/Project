const Problem = require("../models/problem");
const User = require("../models/user.model");
const Submission = require("../models/submission.model");

const {
  getLanguageById,
  submitBatch,
  submitToken,
} = require("../utils/problemUtility");

const createProblem = async (req, res) => {
  const {
    title,
    description,
    difficulty,
    tags,
    visibleTestCases,
    hiddenTestCases,
    startCode,
    referenceSolution,
  } = req.body;

  try {
    if (!title || !description || !difficulty || !tags) {
      throw new Error("Missing fields are required");
    }

    if (!Array.isArray(visibleTestCases) || visibleTestCases.length === 0) {
      throw new Error("visibleTestCases must be a non-empty array");
    }

    if (!Array.isArray(referenceSolution) || referenceSolution.length === 0) {
      throw new Error("referenceSolution must be a non-empty array");
    }

    // ✅ Loop through each reference solution (JavaScript, C++, etc.)
    for (const { language, completeCode } of referenceSolution) {
      const languageId = getLanguageById(language);
      if (!languageId) {
        return res.status(400).send(`Unsupported language: ${language}`);
      }

      console.log(`Creating submissions for language: ${language}`);

      // The submisssions should be array of objects as we saw in docs
      const submissions = visibleTestCases.map((testcase) => ({
        source_code: completeCode,
        language_id: languageId,
        stdin: testcase.input,
        expected_output: testcase.output,
      }));

      console.log(submissions);

      const submitResult = await submitBatch(submissions);
      // I will get token as result
      // By using token we can find if our submissions passed or not
      console.log("SUBMIT RESULT --->", submitResult);

      if (!submitResult || !Array.isArray(submitResult)) {
        return res
          .status(500)
          .send("submitBatch did not return a valid array.");
      }

      const resultToken = submitResult.map((value) => value.token);
      // console.log(resultToken);

      const testresult = await submitToken(resultToken);
      console.log("Testresult --->", testresult);

      for (const test of testresult) {
        if (test.status_id !== 3) {
          console.log(test.status_id);
          return res
            .status(400)
            .send(`Test case failed for language : ${language}`);
        }
      }
    }

    // If for loop completes for all languages and test cases inside it, save to mongoDB

    const userProblem = await Problem.create({
      title,
      description,
      difficulty,
      tags,
      visibleTestCases,
      hiddenTestCases,
      startCode,
      referenceSolution,
      problemCreator: req.result._id, // result was adding in adminMiddleware
    });

    res.status(201).send("Problem saved successfully");
  } catch (err) {
    console.log("Error Occured : " + err.message || err);
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
};

const updateProblem = async (req, res) => {
  const { id } = req.params;

  const {
    title,
    description,
    difficulty,
    tags,
    visibleTestCases,
    hiddenTestCases,
    startCode,
    referenceSolution,
  } = req.body;

  try {
    if (!id) {
      return res
        .status(404)
        .json({ success: false, message: "problem not found" });
    }

    const DsaProblem = await Problem.findById(id);

    if (!DsaProblem) {
      return res
        .status(404)
        .json({ success: false, message: "Problem not found" });
    }

    if (!Array.isArray(visibleTestCases) || visibleTestCases.length === 0) {
      throw new Error("visibleTestCases must be a non-empty array");
    }

    if (!Array.isArray(referenceSolution) || referenceSolution.length === 0) {
      throw new Error("referenceSolution must be a non-empty array");
    }

    for (const { language, completeCode } of referenceSolution) {
      const languageId = getLanguageById(language);
      if (!languageId) {
        return res.status(400).send(`Unsupported language: ${language}`);
      }

      console.log(`Creating submissions for language: ${language}`);

      // The submisssions should be array of objects as we saw in docs
      const submissions = visibleTestCases.map((testcase) => ({
        source_code: completeCode,
        language_id: languageId,
        stdin: testcase.input,
        expected_output: testcase.output,
      }));

      console.log(submissions);

      const submitResult = await submitBatch(submissions);
      // I will get token as result
      // By using token we can find if our submissions passed or not
      console.log("SUBMIT RESULT --->", submitResult);

      if (!submitResult || !Array.isArray(submitResult)) {
        return res
          .status(500)
          .send("submitBatch did not return a valid array.");
      }

      const resultToken = submitResult.map((value) => value.token);
      // console.log(resultToken);

      const testresult = await submitToken(resultToken);
      console.log("Testresult --->", testresult);

      for (const test of testresult) {
        if (test.status_id !== 3) {
          return res
            .status(400)
            .send(`Test case failed for language : ${language}`);
        }
      }
    }

    const newProblem = await Problem.findByIdAndUpdate(
      id,
      {
        ...req.body,
      },
      {
        runValidators: true,
        new: true,
      }
    );

    res.status(200).send("Problem Updated successfully");
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};

const deleteProblem = async (req, res) => {
  const { id } = req.params;
  try {
    const DsaProblem = await Problem.findById(id);

    if (!DsaProblem) {
      return res
        .status(404)
        .json({ success: false, message: "Problem Not Found" });
    }

    const deletedProblem = await Problem.findByIdAndDelete(id);
    if (!deletedProblem) {
      return res.status(404).send("Problemn is missing");
    }

    res.status(200).send("Successfully deleetd");
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};

const fetchProblemById = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).send("Problem Id not Found");
    }

    const fetchProblem = await Problem.findById(id).select(
      "_id title description difficulty tags visibleTestCases hiddenTestCases startCode referenceSolution"
    );

    if (!fetchProblem) {
      return res.status(400).send("Problem not found");
    }
    res.status(200).send(fetchProblem);
  } catch (err) {
    console.log("Error Found : ", err.message);
    res.status(404).json({ success: false, message: err.message });
  }
};

const fetchAllProblem = async (req, res) => {
  const { id } = req.params;

  try {
    const fetchAllProblem = await Problem.find({}).select(
      "_id title description difficulty tags likesCount favoritesCount commentsCount"
    );

    if (fetchAllProblem.length === 0) {
      return res.status(404).send("Problem is missing");
    }

    res.status(200).send(fetchAllProblem);
  } catch (err) {
    return res.status(404).json({ success: false, message: err.message });
  }
};

const solvedAllProblemByuser = async (req, res) => {
  try {
    const userId = req.result._id;

    const user = await User.findById(userId).populate({
      path: "problemSolved",
      select: "_id title difficulty tags",
    });

    return res.status(200).send(user.problemSolved);
  } catch (err) {
    return res.status(404).json({ success: false, message: err.message });
  }
};

const submittedProblem = async (req, res) => {
  try {
    console.log("=== SUBMITTED PROBLEM ENDPOINT CALLED ===");
    console.log("Request method:", req.method);
    console.log("Request URL:", req.url);
    console.log("Request params:", req.params);

    const userId = req.userId; // Use req.userId instead of req.result._id
    const problemId = req.params.pid;

    console.log(
      "Fetching submissions for userId:",
      userId,
      "problemId:",
      problemId
    );
    console.log("Request params:", req.params);
    console.log("Request userId from middleware:", req.userId);

    // Validate inputs
    if (!userId) {
      console.error("No userId found in request");
      return res.status(400).json({ error: "User ID not found" });
    }

    if (!problemId) {
      console.error("No problemId found in request");
      return res.status(400).json({ error: "Problem ID not found" });
    }

    console.log("About to query Submission model...");
    console.log("Query parameters:", { userId, problemId });
    console.log("Submission model:", typeof Submission);
    console.log("Submission.find method:", typeof Submission.find);

    const ans = await Submission.find({ userId, problemId });
    console.log("Query completed successfully");

    console.log("Found submissions:", ans.length);
    console.log("Submissions data:", ans);

    // Always send an array, even if empty
    res.status(200).json(ans);
  } catch (err) {
    console.error("Error fetching submissions:", err);
    console.error("Error stack:", err.stack);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: err.message });
  }
};

module.exports = {
  createProblem,
  updateProblem,
  deleteProblem,
  fetchProblemById,
  fetchAllProblem,
  solvedAllProblemByuser,
  submittedProblem,
};
