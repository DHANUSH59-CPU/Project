import { useState, useEffect } from "react";

const SubmissionResultView = ({ submissionResult, onClose }) => {
  const [animatedPassedCases, setAnimatedPassedCases] = useState(0);
  const [showStatusIcon, setShowStatusIcon] = useState(false);

  const { accepted, totalTestCases, passedTestCases, runtime, memory } =
    submissionResult;
  const isSuccess = accepted;

  useEffect(() => {
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

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
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
      style={{ animation: "fadeIn 0.5s ease-in-out forwards" }}
    >
      {/* Header */}
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
            {/* ✅ 3D Icons */}
            {isSuccess ? (
              <svg
                className="w-10 h-10"
                viewBox="0 0 24 24"
                style={{
                  filter:
                    "drop-shadow(0 4px 10px rgba(34,197,94,0.6)) drop-shadow(0 0 8px rgba(255,255,255,0.4))",
                }}
              >
                <defs>
                  <linearGradient
                    id="grad-success"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#4ade80" />
                    <stop offset="100%" stopColor="#15803d" />
                  </linearGradient>
                </defs>
                <path
                  fill="url(#grad-success)"
                  d="M9 16.17L4.83 12l-1.42 1.41L9 19l12-12-1.41-1.41z"
                />
              </svg>
            ) : (
              <svg
                className="w-10 h-10"
                viewBox="0 0 24 24"
                style={{
                  filter:
                    "drop-shadow(0 4px 10px rgba(239,68,68,0.6)) drop-shadow(0 0 8px rgba(255,255,255,0.4))",
                }}
              >
                <defs>
                  <linearGradient
                    id="grad-error"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#f87171" />
                    <stop offset="100%" stopColor="#b91c1c" />
                  </linearGradient>
                </defs>
                <path
                  fill="url(#grad-error)"
                  d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 
                   5 17.59 6.41 19 12 13.41 17.59 19 
                   19 17.59 13.41 12z"
                />
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

        {/* Close Button 3D */}
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
            viewBox="0 0 24 24"
            style={{
              filter:
                "drop-shadow(0 4px 10px rgba(0,0,0,0.4)) drop-shadow(0 0 6px rgba(255,255,255,0.4))",
            }}
          >
            <defs>
              <linearGradient
                id="grad-close"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#f87171" />
                <stop offset="100%" stopColor="#991b1b" />
              </linearGradient>
            </defs>
            <path
              stroke="url(#grad-close)"
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
            <circle
              className="stroke-base-300/30"
              strokeWidth={12}
              fill="transparent"
              r={60}
              cx={60}
              cy={60}
            />
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

          {/* Center Icon (3D check or X) */}
          <div className="absolute inset-0 flex items-center justify-center">
            {showStatusIcon && (
              <div
                className={`p-6 rounded-full ${
                  isSuccess ? "bg-success/20" : "bg-error/20"
                }`}
                style={{
                  filter: isSuccess
                    ? "drop-shadow(0 6px 10px rgba(34,197,94,0.6))"
                    : "drop-shadow(0 6px 10px rgba(239,68,68,0.6))",
                  transform:
                    "perspective(1000px) rotateX(10deg) rotateY(-5deg)",
                }}
              >
                <svg
                  className={`w-20 h-20`}
                  viewBox="0 0 24 24"
                  style={{
                    filter:
                      "drop-shadow(0 4px 10px rgba(255,255,255,0.4)) drop-shadow(0 0 6px rgba(0,0,0,0.3))",
                  }}
                >
                  <defs>
                    <linearGradient
                      id="grad-center"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop
                        offset="0%"
                        stopColor={isSuccess ? "#4ade80" : "#f87171"}
                      />
                      <stop
                        offset="100%"
                        stopColor={isSuccess ? "#15803d" : "#b91c1c"}
                      />
                    </linearGradient>
                  </defs>
                  {isSuccess ? (
                    <path
                      stroke="url(#grad-center)"
                      strokeWidth={3.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  ) : (
                    <path
                      stroke="url(#grad-center)"
                      strokeWidth={3.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  )}
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionResultView;
