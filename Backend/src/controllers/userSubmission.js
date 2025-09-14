const Problem = require("../models/problem");
const submission = require("../models/submission.model");
const {
  getLanguageById,
  submitBatch,
  submitToken,
} = require("../utils/problemUtility");

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

    // what was code written by user
    console.log(code);

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

    if (!req.result.problemSolved.includes(problemId)) {
      req.result.problemSolved.push(problemId);
      await req.result.save();
    }

    const accepted = status == "accepted";
    res.status(201).json({
      accepted,
      totalTestCases: submittedResult.testCasesTotal,
      passedTestCases: testCasesPassed,
      runtime,
      memory,
    });
  } catch (err) {
    console.log("Error Found : ", err.message);
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

    // what was code written by user
    // console.log(code);

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
    const InformationToSend = testResult.map((test) => ({
      input: test.stdin,
      expected: test.expected_output,
      output: test.stdout.trim(),
      status: test.status.description,
    }));

    return res.status(200).send(InformationToSend);
  } catch (err) {
    console.log("Error Found : ", err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { submitCode, runCode };
