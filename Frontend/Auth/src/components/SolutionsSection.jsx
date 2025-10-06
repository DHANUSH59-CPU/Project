import { useState } from "react";
import Editor from "@monaco-editor/react";
import { SiJavascript, SiOpenjdk, SiCplusplus } from "react-icons/si";

// Language mapping for Monaco Editor
const getMonacoLanguage = (lang) => {
  switch (lang.toLowerCase()) {
    case "c++":
      return "cpp";
    case "javascript":
      return "javascript";
    case "java":
      return "java";
    default:
      return "javascript";
  }
};

const getLanguageIcon = (language) => {
  switch (language.toLowerCase()) {
    case "c++":
      return <SiCplusplus className="w-5 h-5" style={{ color: "#00599C" }} />;
    case "javascript":
      return <SiJavascript className="w-5 h-5" style={{ color: "#F7DF1E" }} />;
    case "java":
      return <SiOpenjdk className="w-5 h-5" style={{ color: "#ED8B00" }} />;
    default:
      return <SiJavascript className="w-5 h-5" style={{ color: "#F7DF1E" }} />;
  }
};

const SolutionsSection = ({ problem }) => {
  const [selectedSolutionLanguage, setSelectedSolutionLanguage] = useState(
    problem?.referenceSolution?.[0]?.language || "C++"
  );

  if (!problem?.referenceSolution || problem.referenceSolution.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-base-200 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-base-content/40"
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
          </div>
          <h3 className="text-xl font-semibold text-base-content mb-2">
            Solutions Not Available
          </h3>
          <p className="text-base-content/70 max-w-md">
            Reference solutions are not available for this problem yet.
          </p>
        </div>
      </div>
    );
  }

  const currentSolution = problem.referenceSolution.find(
    (sol) => sol.language === selectedSolutionLanguage
  );

  return (
    <div className="h-full flex flex-col">
      {/* Language Selector */}
      <div className="flex items-center justify-between p-4 border-b border-base-300 bg-base-100 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-semibold text-base-content">
            Reference Solutions
          </h3>
          <div className="badge badge-info badge-sm">Official</div>
        </div>
        <div className="flex items-center space-x-2">
          {problem.referenceSolution.map((solution) => (
            <button
              key={solution.language}
              onClick={() => setSelectedSolutionLanguage(solution.language)}
              className={`btn btn-sm transition-colors flex items-center gap-2 ${
                selectedSolutionLanguage === solution.language
                  ? "btn-primary"
                  : "btn-outline btn-primary"
              }`}
            >
              {getLanguageIcon(solution.language)}
              {solution.language}
            </button>
          ))}
        </div>
      </div>

      {/* Solution Info */}
      <div className="p-4 bg-base-200 border-b border-base-300 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">
              {getLanguageIcon(selectedSolutionLanguage)}
            </div>
            <div>
              <h4 className="font-semibold text-base-content">
                {selectedSolutionLanguage} Solution
              </h4>
              <p className="text-sm text-base-content/60">
                Optimal approach for this problem
              </p>
            </div>
          </div>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => {
              navigator.clipboard.writeText(
                currentSolution?.completeCode || ""
              );
              // You could add a toast notification here
            }}
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            Copy Code
          </button>
        </div>
      </div>

      {/* Code Display */}
      <div className="flex-grow overflow-hidden">
        {currentSolution ? (
          <Editor
            height="100%"
            language={getMonacoLanguage(selectedSolutionLanguage)}
            value={currentSolution.completeCode}
            theme="vs-dark"
            options={{
              readOnly: true,
              minimap: { enabled: false },
              fontSize: 14,
              tabSize: 2,
              wordWrap: "on",
              automaticLayout: true,
              scrollBeyondLastLine: false,
              lineNumbers: "on",
              glyphMargin: false,
              folding: true,
              renderLineHighlight: "line",
              selectOnLineNumbers: true,
              contextmenu: false, // Disable right-click menu for read-only
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <svg
                className="w-12 h-12 mx-auto mb-4 text-base-content/40"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <p className="text-base-content/70">
                Solution not available for {selectedSolutionLanguage}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Solution Stats */}
      <div className="p-4 bg-base-200 border-t border-base-300 flex-shrink-0">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xs text-base-content/60">Time Complexity</div>
            <div className="font-mono text-sm text-base-content">O(n)</div>
          </div>
          <div>
            <div className="text-xs text-base-content/60">Space Complexity</div>
            <div className="font-mono text-sm text-base-content">O(1)</div>
          </div>
          <div>
            <div className="text-xs text-base-content/60">Approach</div>
            <div className="text-sm text-base-content">Optimal</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolutionsSection;
