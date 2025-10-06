import { useState } from "react";
import ChatInterface from "./ChatInterface";
import CollapsibleSection from "./CollapsibleSection";
import SubmissionResultView from "./SubmissionResultView";
import PastSubmissions from "./PastSubmissions";
import SolutionsSection from "./SolutionsSection";
import VideoPlayer from "./VideoPlayer";

const tabsConfig = [
  {
    name: "Description",
    icon: () => (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  },
  {
    name: "Editorial",
    icon: () => (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
    ),
  },
  {
    name: "Solutions",
    icon: () => (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        />
      </svg>
    ),
  },
  {
    name: "Submissions",
    icon: () => (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
        />
      </svg>
    ),
  },
  {
    name: "Ask AI",
    icon: () => (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
    ),
  },
];

const getProblemPoints = (difficulty) => {
  switch (difficulty) {
    case "easy":
      return 10;
    case "medium":
      return 25;
    case "hard":
      return 50;
    default:
      return 0;
  }
};

const getDifficultyClass = (difficulty) => {
  switch (difficulty) {
    case "easy":
      return "badge-success";
    case "medium":
      return "badge-warning";
    case "hard":
      return "badge-error";
    default:
      return "badge-ghost";
  }
};

const LeftPanel = ({
  problem,
  code,
  submissionResult,
  showSubmissionResult,
  setShowSubmissionResult,
}) => {
  const [activeTab, setActiveTab] = useState("Description");
  const [qaBlocks, setQaBlocks] = useState([]);

  const handleTabChange = (tabName) => {
    if (showSubmissionResult) {
      setShowSubmissionResult(false);
    }
    setActiveTab(tabName);
  };

  const onClose = () => {
    setShowSubmissionResult(false);
  };

  return (
    <div className="h-full flex flex-col bg-base-100">
      {/* Tabs - Hide when submission result is shown */}
      {!showSubmissionResult && (
        <div className="h-[42.4px] flex border-b border-base-300 px-1.5 sm:px-3 bg-base-100 flex-shrink-0">
          {tabsConfig.map((tab) => (
            <button
              key={tab.name}
              onClick={() => handleTabChange(tab.name)}
              className={`flex items-center space-x-1 sm:space-x-1.5 py-2.5 px-2 sm:px-4 text-sm focus:outline-none transition-colors ${
                activeTab === tab.name
                  ? "text-primary border-b-2 border-primary font-medium"
                  : "text-base-content/70 hover:text-base-content"
              }`}
              aria-pressed={activeTab === tab.name}
            >
              <tab.icon />
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* Content - Hide when submission result is shown */}
      {!showSubmissionResult && (
        <div className="flex-grow overflow-hidden">
          {activeTab === "Solutions" ? (
            <SolutionsSection problem={problem} />
          ) : (
            <div className="h-full overflow-y-auto">
              <div className="px-5 pt-5 space-y-5 text-base-content bg-base-100">
                {activeTab === "Description" && (
                  <>
                    {/* Problem Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-end">
                        <h1 className="text-2xl font-medium text-base-content mr-3">
                          {problem.title}
                        </h1>
                      </div>
                      <span className="font-light font-sans tracking-widest text-sm">
                        Points: +{getProblemPoints(problem.difficulty)}
                      </span>
                    </div>

                    {/* Difficulty and Tags */}
                    <div className="flex items-center pb-2 space-x-2 flex-wrap">
                      <span
                        className={`badge ${getDifficultyClass(
                          problem.difficulty
                        )}`}
                      >
                        {problem.difficulty}
                      </span>
                      <a href="#info">
                        <button className="btn btn-xs btn-outline">
                          <svg
                            className="w-3 h-3 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a.997.997 0 01-1.414 0l-7-7A1.997 1.997 0 013 12V7a4 4 0 014-4z"
                            />
                          </svg>
                          Topics
                        </button>
                      </a>
                      <a href="#info">
                        <button className="btn btn-xs btn-outline">
                          <svg
                            className="w-3 h-3 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                          </svg>
                          Companies
                        </button>
                      </a>
                      <a href="#info">
                        <button className="btn btn-xs btn-outline">
                          <svg
                            className="w-3 h-3 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                            />
                          </svg>
                          Hint
                        </button>
                      </a>
                    </div>

                    {/* Problem Description */}
                    <div className="problem-statement">
                      <div className="whitespace-pre-wrap text-base-content">
                        {problem.description}
                      </div>
                    </div>

                    {/* Examples */}
                    <div className="mb-12">
                      {problem.visibleTestCases?.map((testCase, index) => (
                        <div className="mt-4" key={`case${index + 1}`}>
                          <p className="pl-2 mb-1.5">
                            <strong>Example {index + 1}:</strong>
                          </p>
                          <div className="overflow-x-auto p-3 rounded-md text-sm bg-base-200 text-base-content/80">
                            <code>Input: {testCase.input}</code>
                            <br />
                            <code>Output: {testCase.output}</code>
                            <br />
                            <code>Explanation: {testCase.explanation}</code>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Additional Info */}
                    <section id="info">
                      <div className="mt-5 mb-6 space-y-0">
                        <CollapsibleSection
                          title="Topics"
                          icon={() => (
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a.997.997 0 01-1.414 0l-7-7A1.997 1.997 0 013 12V7a4 4 0 014-4z"
                              />
                            </svg>
                          )}
                        >
                          <div className="flex flex-wrap gap-2 p-2">
                            <span className="badge badge-outline">
                              {problem.tags}
                            </span>
                          </div>
                        </CollapsibleSection>

                        <CollapsibleSection
                          title="Companies"
                          icon={() => (
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                              />
                            </svg>
                          )}
                          titleColorClass="text-warning"
                        >
                          <div className="p-4 text-center">
                            <p>Unlock with Premium to see company tags.</p>
                            <button className="btn btn-warning btn-sm mt-3">
                              <svg
                                className="w-4 h-4 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                                />
                              </svg>
                              Upgrade to Premium
                            </button>
                            <div className="mt-4 text-sm text-base-content/60">
                              <p>For now, here are some examples:</p>
                              <ul className="list-disc list-inside mt-1 inline-block text-left">
                                <li>Google</li>
                                <li>Facebook</li>
                                <li>Amazon</li>
                              </ul>
                            </div>
                          </div>
                        </CollapsibleSection>

                        <CollapsibleSection
                          title="Similar Questions"
                          icon={() => (
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 10h16M4 14h16M4 18h16"
                              />
                            </svg>
                          )}
                        >
                          <ul className="space-y-1 p-2">
                            {[
                              { title: "Two Sum", id: "1" },
                              { title: "Valid Parentheses", id: "2" },
                              { title: "Maximum Subarray", id: "3" },
                            ].map((q) => (
                              <li key={q.id}>
                                <a
                                  href={`/problems/${q.id}`}
                                  className="hover:underline text-primary hover:text-primary-focus"
                                >
                                  {q.title}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </CollapsibleSection>
                      </div>
                    </section>
                  </>
                )}

                {activeTab === "Editorial" && (
                  <div className="space-y-6">
                    {/* Video Solution */}
                    <VideoPlayer problemId={problem._id} />
                  </div>
                )}
                {activeTab === "Submissions" && (
                  <PastSubmissions problem={problem} />
                )}
                {activeTab === "Ask AI" && (
                  <ChatInterface
                    problem={problem}
                    userSolution={code}
                    qaBlocks={qaBlocks}
                    setQaBlocks={setQaBlocks}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Submission Result Overlay */}
      {showSubmissionResult && (
        <div className="absolute inset-0 bg-base-100 overflow-y-auto z-10">
          {submissionResult ? (
            <SubmissionResultView
              submissionResult={submissionResult}
              onClose={onClose}
            />
          ) : (
            <div className="h-full w-full flex flex-col items-center justify-center p-4">
              <button
                onClick={onClose}
                className="absolute top-6 right-6 btn btn-ghost btn-sm"
                aria-label="Close submission result"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
              <p className="text-lg font-semibold">
                Submitting your solution...
              </p>
              <p className="text-sm text-base-content/70">
                Please wait a moment.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LeftPanel;
