import { useState, useCallback, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import axiosClient from "../utils/axios";
import TestCasesWindow from "./TestCasesWindow";
import SettingsPopover from "./SettingsPopover";

// Available languages (matching your backend)
const availableLanguages = ["C++", "Java", "JavaScript"];

// Get initial code for a selected language (matching your backend structure)
const getStarterCode = (starterCodes, selectedLanguage) => {
  if (!starterCodes) return "";

  // Map frontend language to backend language format
  const languageMap = {
    cpp: "C++",
    "c++": "C++",
    java: "Java",
    javascript: "JavaScript",
  };

  const backendLanguage =
    languageMap[selectedLanguage.toLowerCase()] || selectedLanguage;

  const starterCode = starterCodes.find(
    (code) => code.language === backendLanguage
  );
  return starterCode?.initialCode || "";
};

// Language mapping for Monaco Editor
const getMonacoLanguage = (lang) => {
  switch (lang.toLowerCase()) {
    case "cpp":
    case "c++":
      return "cpp";
    case "javascript":
      return "javascript";
    case "java":
      return "java";
    default:
      return "cpp"; // Default to C++ since that's your primary language
  }
};

// To store code for different languages
let codes = {};

const RightPanel = ({
  problem,
  code,
  setCode,
  submissionResult,
  setSubmissionResult,
  showSubmissionResult,
  setShowSubmissionResult,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState("cpp");
  const { isAuthenticated } = useSelector((state) => state.authSlice);
  const navigate = useNavigate();
  const [showTestCasesWindow, setShowTestCasesWindow] = useState(false);
  const [testResultsLoading, setTestResultsLoading] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [isEditorSettingOpen, setIsEditorSettingOpen] = useState(false);
  const [editorFontSize, setEditorFontSize] = useState(14);
  const [editorTabSize, setEditorTabSize] = useState(2);
  const [editorTheme, setEditorTheme] = useState("vs-dark");
  const [minimap, setMinimap] = useState(false);

  // Set initial language and code when problem loads
  useEffect(() => {
    if (problem && problem.startCode && problem.startCode.length > 0) {
      // Find the first available language, preferring C++
      const availableBackendLanguages = problem.startCode.map(
        (sc) => sc.language
      );

      let defaultLang = "cpp";
      if (availableBackendLanguages.includes("C++")) {
        defaultLang = "cpp";
      } else if (availableBackendLanguages.includes("JavaScript")) {
        defaultLang = "javascript";
      } else if (availableBackendLanguages.includes("Java")) {
        defaultLang = "java";
      }

      setSelectedLanguage(defaultLang);
      setCode(getStarterCode(problem.startCode, defaultLang));
    }
  }, [problem, setCode]);

  const handleLanguageChange = (event) => {
    codes[selectedLanguage] = code;
    const language = event.target.value;

    // Map display language to internal language
    const languageMap = {
      "C++": "cpp",
      Java: "java",
      JavaScript: "javascript",
    };

    setSelectedLanguage(languageMap[language] || language.toLowerCase());
  };

  useEffect(() => {
    codes = {};
  }, [problem._id]);

  useEffect(() => {
    if (codes[selectedLanguage]) {
      setCode(codes[selectedLanguage]);
    } else {
      setCode(getStarterCode(problem.startCode, selectedLanguage));
    }
  }, [selectedLanguage, problem.startCode, setCode]);

  const handleCodeChange = useCallback(
    (value) => {
      setCode(value || "");
    },
    [setCode]
  );

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setSubmissionResult(null);
    setShowSubmissionResult(true);

    try {
      // Map frontend language to backend language format
      const backendLanguageMap = {
        cpp: "c++",
        javascript: "javascript",
        java: "java",
      };

      const response = await axiosClient.post(
        `/submission/submit/${problem._id}`,
        {
          code: code,
          language: backendLanguageMap[selectedLanguage] || selectedLanguage,
        }
      );
      setSubmissionResult(response.data);
    } catch (error) {
      console.error("Submission error:", error);
      setSubmissionResult({
        error: true,
        message: error.response?.data?.message || "Submission failed",
      });
    }
  };

  const handleRun = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setTestResultsLoading(true);
    if (!showTestCasesWindow) {
      setShowTestCasesWindow(true);
    }
    setTestResults(null);

    try {
      // Map frontend language to backend language format
      const backendLanguageMap = {
        cpp: "c++",
        javascript: "javascript",
        java: "java",
      };

      const response = await axiosClient.post(
        `/submission/run/${problem._id}`,
        {
          code: code,
          language: backendLanguageMap[selectedLanguage] || selectedLanguage,
        }
      );
      setTestResults(response.data);
      console.log("Test Results received:", response.data);
    } catch (error) {
      console.error("Run error:", error);
      setTestResults([]);
    } finally {
      setTestResultsLoading(false);
    }
  };

  const onClose = () => {
    setShowTestCasesWindow(false);
  };

  const handleRefreshCodeButton = () => {
    setCode(getStarterCode(problem.startCode, selectedLanguage));
  };

  return (
    <div className="h-full w-full flex flex-col">
      {/* Top Header - Fixed Height */}
      <div className="h-[48px] flex items-center justify-between px-4 bg-gradient-to-r from-base-200 to-base-200/80 border-b border-base-300/60 backdrop-blur-sm flex-shrink-0 shadow-sm overflow-visible relative z-[9998]">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2.5 text-base-content font-medium">
            <div className="p-1.5 bg-primary/10 rounded-md">
              <svg
                className="w-4 h-4 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
            </div>
            <span className="text-sm font-semibold">Code Editor</span>
          </div>

          <div className="relative group">
            <select
              onChange={handleLanguageChange}
              value={
                selectedLanguage === "cpp"
                  ? "C++"
                  : selectedLanguage === "javascript"
                  ? "JavaScript"
                  : selectedLanguage === "java"
                  ? "Java"
                  : "C++"
              }
              className="appearance-none py-2 pl-4 pr-10 rounded-lg text-sm font-medium focus:outline-none bg-base-100 hover:bg-base-100/80 text-base-content cursor-pointer border border-base-300/60 hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 shadow-sm hover:shadow-md"
              aria-label="Select programming language"
            >
              {availableLanguages.map((lang) => (
                <option
                  key={lang}
                  value={lang}
                  className="bg-base-100 text-base-content py-2"
                >
                  {lang}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-base-content/50 group-hover:text-base-content/70 transition-colors">
              <svg
                className="w-4 h-4 transition-transform group-hover:rotate-180 duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Hide Run/Submit buttons when submission result is showing */}
          {!showSubmissionResult && (
            <>
              {testResultsLoading ? (
                <button
                  className="group relative px-3 sm:px-4 py-1.5 text-xs font-medium bg-success/70 text-white rounded-md cursor-not-allowed overflow-hidden"
                  disabled
                >
                  <div className="flex items-center space-x-1.5 sm:space-x-2">
                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span className="hidden sm:inline">Running...</span>
                    <span className="sm:hidden">Run</span>
                  </div>
                </button>
              ) : (
                <button
                  onClick={handleRun}
                  className="group relative px-4 py-1.5 text-xs font-medium bg-success text-white rounded-md hover:bg-success/90 active:bg-success/80 transition-all duration-200 hover:shadow-lg hover:shadow-success/25 transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <div className="flex items-center space-x-1.5">
                    <svg
                      className="w-3 h-3 transition-transform group-hover:scale-110"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m2-10v18a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2h8l4 4z"
                      />
                    </svg>
                    <span>Run</span>
                  </div>
                </button>
              )}

              <button
                onClick={handleSubmit}
                className="group relative px-4 py-1.5 text-xs font-medium bg-primary text-white rounded-md hover:bg-primary/90 active:bg-primary/80 transition-all duration-200 hover:shadow-lg hover:shadow-primary/25 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <div className="flex items-center space-x-1.5">
                  <svg
                    className="w-3 h-3 transition-transform group-hover:scale-110"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                  <span>Submit</span>
                </div>
              </button>
            </>
          )}

          {/* Show submission status when submitting */}
          {showSubmissionResult && !submissionResult && (
            <div className="flex items-center space-x-2 px-4 py-1.5 text-xs font-medium bg-primary/20 text-primary rounded-md">
              <div className="w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
              <span>Submitting...</span>
            </div>
          )}

          {/* Show result status when submission is complete */}
          {showSubmissionResult && submissionResult && (
            <div className={`flex items-center space-x-2 px-4 py-1.5 text-xs font-medium rounded-md ${
              submissionResult.accepted 
                ? 'bg-success/20 text-success' 
                : 'bg-error/20 text-error'
            }`}>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {submissionResult.accepted ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                )}
              </svg>
              <span>{submissionResult.accepted ? 'Accepted' : 'Wrong Answer'}</span>
            </div>
          )}

          <div className="relative z-[10000]">
            <button
              onClick={() => setIsEditorSettingOpen(!isEditorSettingOpen)}
              className="group p-2 rounded-md hover:bg-base-300/70 text-base-content/60 hover:text-base-content transition-all duration-200 hover:shadow-sm relative z-[10001]"
              aria-label="Editor settings"
              title="Editor Settings"
            >
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${
                  isEditorSettingOpen ? "rotate-90" : "group-hover:rotate-12"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
            {isEditorSettingOpen && (
              <SettingsPopover
                fontSize={editorFontSize}
                setFontSize={setEditorFontSize}
                tabSize={editorTabSize}
                setTabSize={setEditorTabSize}
                editorTheme={editorTheme}
                setEditorTheme={setEditorTheme}
                minimap={minimap}
                setMinimap={setMinimap}
              />
            )}
          </div>

          <button
            onClick={handleRefreshCodeButton}
            className="group p-2 rounded-md hover:bg-base-300/70 text-base-content/60 hover:text-base-content transition-all duration-200 hover:shadow-sm"
            aria-label="Reset to default code"
            title="Reset Code"
          >
            <svg
              className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180"
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
          </button>
        </div>
      </div>

      {/* Code Editor */}
      <div className="flex flex-col flex-1 relative overflow-hidden">
        <div className="h-full">
          <Editor
            height="100%"
            language={getMonacoLanguage(selectedLanguage)}
            value={code}
            onChange={handleCodeChange}
            theme={editorTheme}
            options={{
              fontSize: editorFontSize,
              minimap: { enabled: minimap },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: editorTabSize,
              insertSpaces: true,
              wordWrap: "on",
              lineNumbers: "on",
              glyphMargin: false,
              folding: true,
              lineDecorationsWidth: 10,
              lineNumbersMinChars: 3,
              renderLineHighlight: "line",
              selectOnLineNumbers: true,
              roundedSelection: false,
              readOnly: false,
              cursorStyle: "line",
              mouseWheelZoom: true,
            }}
          />
        </div>

        {/* Test Cases Window */}
        {showTestCasesWindow && (
          <div className="h-[50%] w-full bottom-0 absolute bg-base-100 border-t border-base-300">
            <TestCasesWindow
              testCases={problem.visibleTestCases}
              onClose={onClose}
              testResults={testResults}
              testResultsLoading={testResultsLoading}
            />
          </div>
        )}
      </div>

      {/* Authentication Notice */}
      {!isAuthenticated && (
        <div className="h-10 p-2.5 bg-base-200 text-sm text-center border-t border-base-300 text-base-content flex-shrink-0">
          You need to{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-primary font-semibold hover:underline cursor-pointer mx-1"
          >
            Login
          </span>
          /{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-primary font-semibold hover:underline cursor-pointer ml-1"
          >
            Signup
          </span>{" "}
          to run or submit
        </div>
      )}

      {/* Bottom Status Bar */}
      <div className="h-12 flex items-center justify-between px-4 bg-gradient-to-r from-base-200/80 to-base-200 border-t border-base-300/60 backdrop-blur-sm flex-shrink-0 shadow-sm">
        <div className="flex items-center space-x-4 text-xs text-base-content/60">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span>Ready</span>
          </div>
          <div className="h-4 w-px bg-base-300"></div>
          <span className="font-mono">{selectedLanguage.toUpperCase()}</span>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowTestCasesWindow(!showTestCasesWindow)}
            className={`group flex items-center space-x-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
              showTestCasesWindow
                ? "bg-primary/10 text-primary border border-primary/20"
                : "text-base-content/70 hover:text-base-content hover:bg-base-300/50"
            }`}
          >
            <svg
              className="w-3 h-3"
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
            <span>Test Cases</span>
            {showTestCasesWindow && (
              <div className="w-1 h-1 bg-primary rounded-full"></div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RightPanel;
