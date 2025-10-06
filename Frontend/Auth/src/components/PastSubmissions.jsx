import { useEffect, useState } from "react";
import axiosClient from "../utils/axios";

const getStatusVisuals = (status) => {
  switch (status) {
    case "accepted":
      return {
        icon: (
          <svg
            className="w-5 h-5 text-success"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ),
        color: "text-success",
      };
    case "wrong":
    case "error":
      return {
        icon: (
          <svg
            className="w-5 h-5 text-error"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ),
        color: "text-error",
      };
    case "pending":
    default:
      return {
        icon: (
          <svg
            className="w-5 h-5 text-warning"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ),
        color: "text-warning",
      };
  }
};

const getProcessedStatus = (status) => {
  switch (status) {
    case "accepted":
      return "Accepted";
    case "wrong":
      return "Wrong Answer";
    case "error":
      return "Runtime Error";
    case "pending":
      return "Pending";
    default:
      return "Unknown";
  }
};

const getProcessedLanguage = (language) => {
  switch (language) {
    case "c++":
      return "C++";
    case "javascript":
      return "JavaScript";
    case "java":
      return "Java";
    default:
      return language;
  }
};

const getTimeStamp = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }
};

function PastSubmissions({ problem }) {
  const [submissions, setSubmissions] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    const getPastSubmissions = async () => {
      try {
        console.log("Fetching submissions for problem:", problem._id);
        const response = await axiosClient.get(
          `/problem/submittedProblem/${problem._id}`
        );

        console.log("Submissions response:", response.data);

        // Handle both array and string responses
        let submissionsData = response.data;
        if (typeof submissionsData === "string") {
          console.log("Received string response, treating as empty array");
          submissionsData = [];
        }

        if (!Array.isArray(submissionsData)) {
          console.log("Response is not an array, treating as empty");
          submissionsData = [];
        }

        const modifiedSubmissions = submissionsData.map((sub) => {
          const processedStatus = getProcessedStatus(sub.status);

          return {
            id: sub._id,
            status: processedStatus,
            problemTitle: problem.title,
            language: getProcessedLanguage(sub.language),
            runtime: sub.runtime ? sub.runtime + " ms" : "N/A",
            memory: sub.memory ? sub.memory + " KB" : "N/A",
            timestamp: getTimeStamp(sub.submittedAt || sub.createdAt),
            code: sub.code || "Code not available for this submission.",
            passedCases: sub.testCasesPassed || 0,
            totalCases: sub.testCasesTotal || 0,
            errorMessage: sub.errorMessage || "",
          };
        });

        console.log("Processed submissions:", modifiedSubmissions);
        setSubmissions(modifiedSubmissions);
      } catch (error) {
        console.error("Error fetching submissions:", error);
        console.error("Error details:", error.response?.data);
        console.error("Error status:", error.response?.status);
        console.error("Error headers:", error.response?.headers);
        console.error("Full error response:", error.response);
        setSubmissions([]);
      }
    };

    if (problem?._id) {
      getPastSubmissions();
    }
  }, [problem._id, problem.title]);

  const openSubmissionDetails = (submission) => {
    setSelectedSubmission(submission);
  };

  const closeSubmissionDetails = () => {
    setSelectedSubmission(null);
  };

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === "Escape" && selectedSubmission) {
        closeSubmissionDetails();
      }
    };

    if (selectedSubmission) {
      document.addEventListener("keydown", handleEscapeKey);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "unset";
    };
  }, [selectedSubmission]);

  if (submissions === null) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center p-4">
        <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
        <p className="text-base-content/70">Loading submissions...</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4 pb-5">
        <h2 className="text-xl font-semibold text-base-content">
          My Submissions
        </h2>
        {submissions?.length > 0 ? (
          <ul className="space-y-3">
            {submissions
              .slice()
              .reverse()
              .map((sub) => {
                const { icon, color: statusColor } = getStatusVisuals(
                  sub.status.toLowerCase()
                );
                return (
                  <li
                    key={sub.id}
                    className="p-4 rounded-lg border border-base-300 bg-base-100 hover:border-base-400 transition-all cursor-pointer"
                    onClick={() => openSubmissionDetails(sub)}
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                      <div className="flex-1 mb-3 sm:mb-0">
                        <div className="flex items-center mb-1.5">
                          <span className="mr-2">{icon}</span>
                          <span
                            className={`font-semibold text-md ${statusColor}`}
                          >
                            {sub.status}
                          </span>
                        </div>
                        <p className="text-xs text-base-content/60">
                          Language:{" "}
                          <span className="font-medium text-base-content">
                            {sub.language}
                          </span>
                        </p>
                      </div>
                      <div className="flex-1 text-sm mb-3 sm:mb-0 sm:px-4 text-base-content/70">
                        <p>
                          Runtime:{" "}
                          <span className="font-medium text-base-content">
                            {sub.runtime}
                          </span>
                        </p>
                        <p>
                          Memory:{" "}
                          <span className="font-medium text-base-content">
                            {sub.memory}
                          </span>
                        </p>
                      </div>
                      <div className="flex flex-col items-start sm:items-end w-full sm:w-auto">
                        <p className="text-xs mb-2 text-base-content/60">
                          {sub.timestamp}
                        </p>
                        <div className="text-xs text-base-content/60">
                          {sub.passedCases}/{sub.totalCases} test cases
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
          </ul>
        ) : (
          <div className="text-center py-10">
            <svg
              className="w-16 h-16 mx-auto mb-4 text-base-content/40"
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
            <p className="text-base-content/70 text-lg font-medium">
              No submissions yet
            </p>
            <p className="text-base-content/50 text-sm">
              Submit your solution to see your submission history here.
            </p>
          </div>
        )}
      </div>

      {/* Submission Details Modal */}
      {selectedSubmission && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10002] p-4"
          onClick={closeSubmissionDetails}
        >
          <div
            className="bg-base-100 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-base-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-base-300 bg-base-100">
              <h3 className="text-lg font-semibold text-base-content">
                Submission Details
              </h3>
              <button
                onClick={closeSubmissionDetails}
                className="btn btn-ghost btn-sm hover:bg-base-200 transition-colors duration-200"
                aria-label="Close submission details"
                title="Close"
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
            </div>

            {/* Modal Content */}
            <div className="p-4 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* Status and Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-3 bg-base-200 rounded-lg">
                  <div className="text-sm text-base-content/60">Status</div>
                  <div
                    className={`font-semibold ${
                      getStatusVisuals(selectedSubmission.status.toLowerCase())
                        .color
                    }`}
                  >
                    {selectedSubmission.status}
                  </div>
                </div>
                <div className="text-center p-3 bg-base-200 rounded-lg">
                  <div className="text-sm text-base-content/60">Runtime</div>
                  <div className="font-semibold text-base-content">
                    {selectedSubmission.runtime}
                  </div>
                </div>
                <div className="text-center p-3 bg-base-200 rounded-lg">
                  <div className="text-sm text-base-content/60">Memory</div>
                  <div className="font-semibold text-base-content">
                    {selectedSubmission.memory}
                  </div>
                </div>
              </div>

              {/* Code */}
              <div className="mb-4">
                <h4 className="text-md font-semibold text-base-content mb-2">
                  Code ({selectedSubmission.language})
                </h4>
                <pre className="bg-base-200 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{selectedSubmission.code}</code>
                </pre>
              </div>

              {/* Error Message */}
              {selectedSubmission.errorMessage && (
                <div className="mb-4">
                  <h4 className="text-md font-semibold text-error mb-2">
                    Error Message
                  </h4>
                  <pre className="bg-error/10 border border-error/20 p-4 rounded-lg overflow-x-auto text-sm text-error">
                    {selectedSubmission.errorMessage}
                  </pre>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end p-4 border-t border-base-300 bg-base-50">
              <button
                onClick={closeSubmissionDetails}
                className="btn btn-primary btn-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PastSubmissions;
