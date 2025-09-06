const { json } = require("express");
const Problem = require("../models/problem");

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

module.exports = { createProblem };
