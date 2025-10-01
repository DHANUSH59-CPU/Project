import { useState, useCallback, useEffect, useRef } from "react";
import axiosClient from "../utils/axios";
import { useParams } from "react-router";
import Loading from "./Loading";
import LeftPanel from "./LeftPanel";
import RightPanel from "./RightPanel";
import Timer from "./Timer";
import SocialActions from "./SocialActions";
import CommentsSection from "./CommentsSection";

const ProblemSolvingPage = () => {
  const { problemId } = useParams();
  const [loading, setLoading] = useState(true);
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState("");
  const [submissionResult, setSubmissionResult] = useState(null);
  const [showSubmissionResult, setShowSubmissionResult] = useState(false);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showComments, setShowComments] = useState(false);

  // --- Resizing Logic ---
  const [leftPanelWidth, setLeftPanelWidth] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth * 0.5;
    }
    return 500;
  });
  const [isResizing, setIsResizing] = useState(false);
  const problemPageRef = useRef(null);
  const minLeftPanelWidth = 200;
  const minRightPanelWidth = 200;
  const dividerActualWidth = 3;

  const handleMouseDownOnDivider = useCallback((e) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  const handleMouseMove = useCallback(
    (event) => {
      if (!isResizing || !problemPageRef.current) return;

      const problemPageRect = problemPageRef.current.getBoundingClientRect();
      let newLeftPanelWidth = event.clientX - problemPageRect.left;
      const totalWidth = problemPageRect.width;
      const maxLeftPanelWidth =
        totalWidth - minRightPanelWidth - dividerActualWidth;

      if (newLeftPanelWidth < minLeftPanelWidth) {
        newLeftPanelWidth = minLeftPanelWidth;
      } else if (newLeftPanelWidth > maxLeftPanelWidth) {
        newLeftPanelWidth = maxLeftPanelWidth;
      }

      setLeftPanelWidth(newLeftPanelWidth);
    },
    [isResizing]
  );

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    const handleWindowResize = () => {
      if (
        !isResizing &&
        typeof window !== "undefined" &&
        problemPageRef.current
      ) {
        const currentPercentage =
          leftPanelWidth / problemPageRef.current.getBoundingClientRect().width;
        let newWidth = window.innerWidth * currentPercentage;
        const totalWidth = window.innerWidth;
        const maxLeftPanelWidth =
          totalWidth - minRightPanelWidth - dividerActualWidth;

        if (newWidth < minLeftPanelWidth) newWidth = minLeftPanelWidth;
        if (newWidth > maxLeftPanelWidth) newWidth = maxLeftPanelWidth;

        setLeftPanelWidth(newWidth);
      }
    };

    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, [isResizing, leftPanelWidth]);

  // Fetch problem data
  useEffect(() => {
    const fetchProblemDetails = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get(
          `/problem/problemById/${problemId}`
        );
        setProblem(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching problem:", error);
        setLoading(false);
      }
    };

    if (problemId) {
      fetchProblemDetails();
    }
  }, [problemId]);

  if (loading) {
    return <Loading />;
  }

  if (!problem) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-base-content mb-2">
            Problem not found
          </h2>
          <p className="text-base-content/70">
            The requested problem could not be loaded.
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex flex-col h-screen w-screen bg-base-200">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-4 bg-base-100 border-b border-base-300 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <h1 className="text-xl font-bold text-base-content">
            {problem.title}
          </h1>
          <span
            className={`badge ${
              problem.difficulty === "easy"
                ? "badge-success"
                : problem.difficulty === "medium"
                ? "badge-warning"
                : "badge-error"
            }`}
          >
            {problem.difficulty}
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <Timer
            isTimerRunning={isTimerRunning}
            setIsTimerRunning={setIsTimerRunning}
          />
          <button
            onClick={() => setShowComments(!showComments)}
            className={`btn btn-sm ${
              showComments ? "btn-primary" : "btn-ghost"
            } flex items-center space-x-2`}
            title="Toggle Comments"
          >
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 24 24"
              style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))" }}
            >
              <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
            </svg>
            <span>Comments</span>
          </button>
          <button className="btn btn-ghost btn-sm" title="Fullscreen">
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
                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Main area with resizable panels */}
      <div
        ref={problemPageRef}
        className="flex flex-grow w-full overflow-hidden bg-base-200 relative"
      >
        {/* Left Panel - Problem Description */}
        <div
          style={{ width: `${leftPanelWidth}px` }}
          className="h-full overflow-hidden flex-shrink-0 bg-base-100 flex flex-col"
        >
          <div className="flex-1 overflow-y-auto">
            <LeftPanel
              problem={problem}
              code={code}
              submissionResult={submissionResult}
              showSubmissionResult={showSubmissionResult}
              setShowSubmissionResult={setShowSubmissionResult}
            />
          </div>

          {/* Social Actions - Hide when submission result is shown */}
          {!showSubmissionResult && (
            <SocialActions
              problemId={problemId}
              initialLikesCount={problem.likesCount || 0}
              initialFavoritesCount={problem.favoritesCount || 0}
              initialCommentsCount={problem.commentsCount || 0}
            />
          )}
        </div>

        {/* Divider - Hide when submission result is shown */}
        {!showSubmissionResult && (
          <div
            className="cursor-e-resize bg-base-300 hover:bg-primary transition-colors duration-150 flex-shrink-0"
            style={{ width: `${dividerActualWidth}px` }}
            onMouseDown={handleMouseDownOnDivider}
            role="separator"
            aria-orientation="vertical"
            tabIndex={0}
          />
        )}

        {/* Right Panel - Code Editor - Hide when submission result is shown */}
        {!showSubmissionResult && (
          <div className="flex-grow h-full overflow-hidden bg-base-100 flex flex-col">
            {showComments ? (
              <div className="flex-1 overflow-hidden">
                <CommentsSection problemId={problemId} />
              </div>
            ) : (
              <RightPanel
                code={code}
                setCode={setCode}
                problem={problem}
                submissionResult={submissionResult}
                setSubmissionResult={setSubmissionResult}
                showSubmissionResult={showSubmissionResult}
                setShowSubmissionResult={setShowSubmissionResult}
              />
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default ProblemSolvingPage;
