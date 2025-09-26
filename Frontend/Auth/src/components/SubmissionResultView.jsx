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
      className="w-full flex flex-col flex-grow p-6 bg-base-100"
      style={{
        animation: "fadeIn 0.3s ease-in-out forwards",
      }}
    >
      {/* Header with improved close button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-3xl font-bold ${statusColorClass}`}>
          {isSuccess ? "Accepted" : "Wrong Answer"}
        </h2>
        <button
          onClick={onClose}
          className="btn btn-ghost btn-sm hover:btn-error hover:bg-error/10 transition-all duration-200 group"
          aria-label="Close submission result"
          title="Close Result"
        >
          <svg
            className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200"
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

      {/* Circular Progress */}
      <div className="flex-grow flex flex-col items-center justify-center py-6">
        <div className="relative w-32 h-32">
          <svg
            className="w-full h-full transform -rotate-90"
            viewBox="0 0 120 120"
          >
            <circle
              className="stroke-base-300"
              strokeWidth={8}
              fill="transparent"
              r={60}
              cx={60}
              cy={60}
            />
            <circle
              className={`${circleStrokeClass} transition-all duration-300 ease-linear`}
              strokeWidth={8}
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
              isSuccess ? (
                <svg
                  className={`w-12 h-12 ${statusColorClass}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg
                  className={`w-12 h-12 ${statusColorClass}`}
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
              )
            ) : (
              <div className="text-center">
                <span className="block text-2xl font-semibold text-base-content">
                  {animatedPassedCases}
                </span>
                <span className="block text-sm text-base-content/60">
                  / {totalTestCases}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="mt-auto pt-6 border-t border-base-300">
        <div className="grid grid-cols-2 gap-4 text-sm mb-6">
          <div className="flex justify-center items-center p-4 rounded-lg bg-base-200">
            <div className="text-center">
              <span className="block text-sm text-base-content/60">
                Runtime
              </span>
              <strong className="font-medium text-base-content">
                {runtime ? `${runtime} ms` : "N/A"}
              </strong>
            </div>
          </div>
          <div className="flex justify-center items-center p-4 rounded-lg bg-base-200">
            <div className="text-center">
              <span className="block text-sm text-base-content/60">Memory</span>
              <strong className="font-medium text-base-content">
                {memory ? `${memory} KB` : "N/A"}
              </strong>
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center p-4 rounded-lg bg-base-200">
          <div className="text-center">
            <span className="block text-sm text-base-content/60">
              Test Cases Passed
            </span>
            <strong className="font-medium text-base-content">
              {passedTestCases || 0} / {totalTestCases}
            </strong>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 btn btn-primary hover:scale-105 transition-transform duration-200"
          >
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
                d="M11 17l-5-5m0 0l5-5m-5 5h12"
              />
            </svg>
            Back to Code
          </button>
          {!isSuccess && (
            <button
              onClick={onClose}
              className="flex-1 btn btn-outline btn-secondary hover:scale-105 transition-transform duration-200"
            >
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
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubmissionResultView;
