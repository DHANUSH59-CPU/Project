import { useState, useEffect } from "react";

const SubmissionResultView = ({ submissionResult, onClose }) => {
  const [animatedPassedCases, setAnimatedPassedCases] = useState(0);
  const [showStatusIcon, setShowStatusIcon] = useState(false);

  const { accepted, totalTestCases, passedTestCases, runtime, memory } =
    submissionResult;
  const isSuccess = accepted;

  useEffect(() => {
    // Animate the progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 1;
      setAnimatedPassedCases(Math.min(progress, passedTestCases || 0));

      if (progress >= (passedTestCases || 0)) {
        clearInterval(interval);
        setTimeout(() => setShowStatusIcon(true), 200);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [passedTestCases]);

  // Add keyboard shortcut support
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const statusColorClass = isSuccess ? "text-success" : "text-error";
  const circleStrokeClass = isSuccess ? "stroke-success" : "stroke-error";

  const circumference = 2 * Math.PI * 60;
  const strokeDashoffset =
    circumference - (animatedPassedCases / totalTestCases) * circumference;

  return (
    <div
      className="w-full flex flex-col flex-grow p-8 bg-gradient-to-br from-base-100 to-base-200 min-h-screen"
      style={{
        animation: "fadeIn 0.5s ease-in-out forwards",
      }}
    >
      {/* Header with improved close button */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <div
            className={`p-4 rounded-full ${
              isSuccess ? "bg-success/20" : "bg-error/20"
            }`}
            style={{
              filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))",
              transform: "perspective(1000px) rotateX(15deg) rotateY(-5deg)",
            }}
          >
            {isSuccess ? (
              <svg
                className="w-10 h-10 text-success"
                fill="currentColor"
                viewBox="0 0 24 24"
                style={{
                  filter: "drop-shadow(0 2px 4px rgba(34, 197, 94, 0.4))",
                }}
              >
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
            ) : (
              <svg
                className="w-10 h-10 text-error"
                fill="currentColor"
                viewBox="0 0 24 24"
                style={{
                  filter: "drop-shadow(0 2px 4px rgba(239, 68, 68, 0.4))",
                }}
              >
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            )}
          </div>
          <div>
            <h2 className={`text-4xl font-bold ${statusColorClass} mb-2`}>
              {isSuccess ? "🎉 Accepted!" : "❌ Wrong Answer"}
            </h2>
            <p className="text-base-content/70 text-lg">
              {isSuccess
                ? "Congratulations! Your solution passed all test cases."
                : "Your solution didn't pass all test cases. Try again!"}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="btn btn-ghost btn-sm hover:btn-error hover:bg-error/10 transition-all duration-200 group"
          aria-label="Close submission result"
          title="Close Result"
          style={{
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
          }}
        >
          <svg
            className="w-6 h-6 group-hover:rotate-90 transition-transform duration-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            style={{
              filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))",
            }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Circular Progress */}
      <div className="flex-grow flex flex-col items-center justify-center py-8">
        <div className="relative w-40 h-40 mb-6">
          <svg
            className="w-full h-full transform -rotate-90 drop-shadow-lg"
            viewBox="0 0 120 120"
          >
            {/* Background circle with glow effect */}
            <circle
              className="stroke-base-300/30"
              strokeWidth={12}
              fill="transparent"
              r={60}
              cx={60}
              cy={60}
            />
            {/* Progress circle */}
            <circle
              className={`${circleStrokeClass} transition-all duration-500 ease-out drop-shadow-lg`}
              strokeWidth={12}
              strokeDasharray={circumference}
              style={{ strokeDashoffset }}
              strokeLinecap="round"
              fill="transparent"
              r={60}
              cx={60}
              cy={60}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            {showStatusIcon ? (
              <div className="flex flex-col items-center">
                {isSuccess ? (
                  <div
                    className={`p-6 rounded-full bg-success/20 success-glow success-bounce`}
                    style={{
                      filter: "drop-shadow(0 6px 12px rgba(34, 197, 94, 0.4))",
                      transform:
                        "perspective(1000px) rotateX(10deg) rotateY(-5deg)",
                    }}
                  >
                    <svg
                      className={`w-20 h-20 ${statusColorClass}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      style={{
                        filter: "drop-shadow(0 3px 6px rgba(34, 197, 94, 0.5))",
                      }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3.5}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                ) : (
                  <div
                    className="p-6 rounded-full bg-error/20 animate-pulse"
                    style={{
                      filter: "drop-shadow(0 6px 12px rgba(239, 68, 68, 0.4))",
                      transform:
                        "perspective(1000px) rotateX(10deg) rotateY(-5deg)",
                    }}
                  >
                    <svg
                      className={`w-20 h-20 ${statusColorClass}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      style={{
                        filter: "drop-shadow(0 3px 6px rgba(239, 68, 68, 0.5))",
                      }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3.5}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                )}
                <div className="mt-4 text-center">
                  <div className={`text-2xl font-bold ${statusColorClass}`}>
                    {passedTestCases} / {totalTestCases}
                  </div>
                  <div className="text-sm text-base-content/60">Test Cases</div>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-4xl font-bold text-base-content mb-2">
                  {animatedPassedCases}
                </div>
                <div className="text-lg text-base-content/60">
                  / {totalTestCases}
                </div>
                <div className="text-sm text-base-content/50 mt-1">
                  Test Cases
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Progress percentage */}
        <div className="text-center">
          <div className={`text-3xl font-bold ${statusColorClass} mb-2`}>
            {Math.round((passedTestCases / totalTestCases) * 100)}%
          </div>
          <div className="text-base-content/60">
            {isSuccess ? "Complete!" : "Progress"}
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="mt-auto pt-8 border-t border-base-300/50">
        <h3 className="text-xl font-semibold text-base-content mb-6 text-center">
          Performance Metrics
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="group p-6 rounded-xl bg-gradient-to-br from-base-200 to-base-300 hover:shadow-lg transition-all duration-300 hover:scale-105 shimmer-effect">
            <div className="flex items-center gap-4">
              <div
                className="p-4 rounded-full bg-primary/20 group-hover:animate-pulse"
                style={{
                  filter: "drop-shadow(0 4px 8px rgba(59, 130, 246, 0.3))",
                  transform:
                    "perspective(1000px) rotateX(15deg) rotateY(-5deg)",
                }}
              >
                <svg
                  className="w-8 h-8 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  style={{
                    filter: "drop-shadow(0 2px 4px rgba(59, 130, 246, 0.4))",
                  }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div>
                <span className="block text-sm text-base-content/60 font-medium">
                  Runtime
                </span>
                <strong className="text-2xl font-bold text-base-content">
                  {runtime ? `${runtime} ms` : "N/A"}
                </strong>
              </div>
            </div>
          </div>

          <div className="group p-6 rounded-xl bg-gradient-to-br from-base-200 to-base-300 hover:shadow-lg transition-all duration-300 hover:scale-105 shimmer-effect">
            <div className="flex items-center gap-4">
              <div
                className="p-4 rounded-full bg-secondary/20 group-hover:animate-pulse"
                style={{
                  filter: "drop-shadow(0 4px 8px rgba(168, 85, 247, 0.3))",
                  transform:
                    "perspective(1000px) rotateX(15deg) rotateY(-5deg)",
                }}
              >
                <svg
                  className="w-8 h-8 text-secondary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  style={{
                    filter: "drop-shadow(0 2px 4px rgba(168, 85, 247, 0.4))",
                  }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                  />
                </svg>
              </div>
              <div>
                <span className="block text-sm text-base-content/60 font-medium">
                  Memory Usage
                </span>
                <strong className="text-2xl font-bold text-base-content">
                  {memory ? `${memory} KB` : "N/A"}
                </strong>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-xl bg-gradient-to-r from-base-200 to-base-300 mb-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div
                className="p-3 rounded-full bg-accent/20"
                style={{
                  filter: "drop-shadow(0 4px 8px rgba(34, 197, 94, 0.3))",
                  transform:
                    "perspective(1000px) rotateX(15deg) rotateY(-5deg)",
                }}
              >
                <svg
                  className="w-7 h-7 text-accent"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  style={{
                    filter: "drop-shadow(0 2px 4px rgba(34, 197, 94, 0.4))",
                  }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <span className="text-lg font-semibold text-base-content">
                Test Results Summary
              </span>
            </div>
            <div className="text-3xl font-bold text-base-content mb-2">
              {passedTestCases || 0} / {totalTestCases}
            </div>
            <div className="text-base-content/60">Test Cases Passed</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <button
            onClick={onClose}
            className="flex-1 btn btn-primary btn-lg hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            style={{
              filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))",
            }}
          >
            <svg
              className="w-6 h-6 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M11 17l-5-5m0 0l5-5m-5 5h12"
              />
            </svg>
            Back to Code
          </button>
          {!isSuccess && (
            <button
              onClick={onClose}
              className="flex-1 btn btn-outline btn-secondary btn-lg hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              style={{
                filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))",
              }}
            >
              <svg
                className="w-6 h-6 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{
                  filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Try Again
            </button>
          )}
          {isSuccess && (
            <button
              onClick={onClose}
              className="flex-1 btn btn-success btn-lg hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              style={{
                filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))",
              }}
            >
              <svg
                className="w-6 h-6 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{
                  filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubmissionResultView;
