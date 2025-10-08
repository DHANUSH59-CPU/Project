import { useState, useEffect } from "react";

const SubmissionResultView = ({ submissionResult, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  const { accepted, totalTestCases, passedTestCases, runtime, memory } =
    submissionResult;
  const isSuccess = accepted;

  useEffect(() => {
    setIsVisible(true);
  }, []);

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

  return (
    <div
      className={`w-full flex flex-col flex-grow p-8 min-h-screen transition-all duration-1000 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${
        isSuccess
          ? "bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-emerald-950 dark:via-green-950 dark:to-teal-950"
          : "bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 dark:from-red-950 dark:via-rose-950 dark:to-pink-950"
      }`}
      style={{
        backgroundImage: isSuccess
          ? "radial-gradient(circle at 20% 80%, rgba(34, 197, 94, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)"
          : "radial-gradient(circle at 20% 80%, rgba(239, 68, 68, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(220, 38, 38, 0.1) 0%, transparent 50%)",
      }}
    >
      {/* Header with improved close button */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-6">
          <div
            className={`p-6 rounded-2xl backdrop-blur-sm border transition-all duration-500 hover:scale-110 ${
              isSuccess
                ? "bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 border-emerald-200 dark:border-emerald-700"
                : "bg-gradient-to-br from-red-100 to-rose-100 dark:from-red-900/30 dark:to-rose-900/30 border-red-200 dark:border-red-700"
            }`}
            style={{
              filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.15))",
              transform: "perspective(1000px) rotateX(10deg) rotateY(-3deg)",
            }}
          >
            {isSuccess ? (
              <svg
                className="w-12 h-12 text-emerald-600 dark:text-emerald-400 transition-all duration-300 hover:scale-110"
                fill="currentColor"
                viewBox="0 0 24 24"
                style={{
                  filter: "drop-shadow(0 4px 8px rgba(34, 197, 94, 0.3))",
                }}
              >
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
            ) : (
              <svg
                className="w-12 h-12 text-red-600 dark:text-red-400 transition-all duration-300 hover:scale-110"
                fill="currentColor"
                viewBox="0 0 24 24"
                style={{
                  filter: "drop-shadow(0 4px 8px rgba(239, 68, 68, 0.3))",
                }}
              >
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            )}
          </div>
          <div className="space-y-3">
            <h2
              className={`text-5xl font-black tracking-tight mb-3 bg-gradient-to-r ${
                isSuccess
                  ? "from-emerald-600 to-green-600 dark:from-emerald-400 dark:to-green-400"
                  : "from-red-600 to-rose-600 dark:from-red-400 dark:to-rose-400"
              } bg-clip-text text-transparent`}
            >
              {isSuccess ? "🎉 Accepted!" : "❌ Wrong Answer"}
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-xl font-medium leading-relaxed">
              {isSuccess
                ? "Congratulations! Your solution passed all test cases."
                : "Your solution didn't pass all test cases. Try again!"}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="group relative p-3 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-700 transition-all duration-300 hover:scale-105"
          aria-label="Close submission result"
          title="Close Result"
          style={{
            filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))",
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

      {/* Details */}
      <div className="mt-auto pt-8 border-t border-slate-200 dark:border-slate-700">
        <h3 className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-8 text-center">
          Performance Metrics
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="group p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700 hover:shadow-xl transition-all duration-300 hover:scale-105 backdrop-blur-sm">
            <div className="flex items-center gap-6">
              <div
                className="p-5 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-800/40 dark:to-indigo-800/40 group-hover:animate-pulse border border-blue-200 dark:border-blue-600"
                style={{
                  filter: "drop-shadow(0 6px 12px rgba(59, 130, 246, 0.2))",
                  transform:
                    "perspective(1000px) rotateX(10deg) rotateY(-3deg)",
                }}
              >
                <svg
                  className="w-10 h-10 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  style={{
                    filter: "drop-shadow(0 2px 4px rgba(59, 130, 246, 0.3))",
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
                <span className="block text-sm text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wide">
                  Runtime
                </span>
                <strong className="text-3xl font-black text-slate-700 dark:text-slate-300">
                  {runtime ? `${runtime} ms` : "N/A"}
                </strong>
              </div>
            </div>
          </div>

          <div className="group p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-700 hover:shadow-xl transition-all duration-300 hover:scale-105 backdrop-blur-sm">
            <div className="flex items-center gap-6">
              <div
                className="p-5 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-800/40 dark:to-pink-800/40 group-hover:animate-pulse border border-purple-200 dark:border-purple-600"
                style={{
                  filter: "drop-shadow(0 6px 12px rgba(168, 85, 247, 0.2))",
                  transform:
                    "perspective(1000px) rotateX(10deg) rotateY(-3deg)",
                }}
              >
                <svg
                  className="w-10 h-10 text-purple-600 dark:text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  style={{
                    filter: "drop-shadow(0 2px 4px rgba(168, 85, 247, 0.3))",
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
                <span className="block text-sm text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wide">
                  Memory Usage
                </span>
                <strong className="text-3xl font-black text-slate-700 dark:text-slate-300">
                  {memory ? `${memory} KB` : "N/A"}
                </strong>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 rounded-2xl bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-800/50 dark:to-gray-800/50 border border-slate-200 dark:border-slate-700 mb-8 backdrop-blur-sm">
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div
                className="p-4 rounded-2xl bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-800/40 dark:to-green-800/40 border border-emerald-200 dark:border-emerald-600"
                style={{
                  filter: "drop-shadow(0 6px 12px rgba(34, 197, 94, 0.2))",
                  transform:
                    "perspective(1000px) rotateX(10deg) rotateY(-3deg)",
                }}
              >
                <svg
                  className="w-8 h-8 text-emerald-600 dark:text-emerald-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  style={{
                    filter: "drop-shadow(0 2px 4px rgba(34, 197, 94, 0.3))",
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
              <span className="text-xl font-bold text-slate-700 dark:text-slate-300">
                Test Results Summary
              </span>
            </div>
            <div className="text-4xl font-black text-slate-700 dark:text-slate-300 mb-2">
              {passedTestCases || 0} / {totalTestCases}
            </div>
            <div className="text-slate-500 dark:text-slate-400 font-medium">
              Test Cases Passed
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 mt-8">
          <button
            onClick={onClose}
            className="flex-1 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-lg hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl border border-blue-500/20"
            style={{
              filter: "drop-shadow(0 8px 16px rgba(59, 130, 246, 0.3))",
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
              className="flex-1 px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-lg hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl border border-red-500/20"
              style={{
                filter: "drop-shadow(0 8px 16px rgba(239, 68, 68, 0.3))",
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
              className="flex-1 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold text-lg hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl border border-emerald-500/20"
              style={{
                filter: "drop-shadow(0 8px 16px rgba(34, 197, 94, 0.3))",
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
