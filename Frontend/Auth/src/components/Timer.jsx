import { useState, useEffect, useRef } from "react";

const Timer = ({ isTimerRunning, setIsTimerRunning }) => {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("timer"); // "stopwatch" or "timer"
  const [hasStarted, setHasStarted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [timerInput, setTimerInput] = useState(1200); // default 20 mins
  const intervalRef = useRef(null);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // Sync timer value only when timerInput or mode changes
  useEffect(() => {
    if (mode === "timer" && !isTimerRunning && secondsLeft === 0 && !hasStarted) {
      setSecondsLeft(timerInput);
    }
  }, [timerInput, mode, hasStarted, isTimerRunning]);

  // Ticking logic
  useEffect(() => {
    if (isTimerRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (mode === "timer") {
            if (prev > 0) return prev - 1;
            clearInterval(intervalRef.current);
            setIsTimerRunning(false);
            return 0;
          } else {
            return prev + 1;
          }
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isTimerRunning, mode, setIsTimerRunning]);

  const toggleStartPause = () => {
    if (isTimerRunning) {
      setIsTimerRunning(false);
      return;
    }
    if (!isTimerRunning) {
      if (mode === "timer" && secondsLeft === 0) {
        setSecondsLeft(timerInput);
      }
      setOpen(false);
      setIsTimerRunning(true);
      setHasStarted(true);
    }
  };

  const reset = () => {
    clearInterval(intervalRef.current);
    setIsTimerRunning(false);
    setHasStarted(false);
    setSecondsLeft(mode === "timer" ? timerInput : 0);
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setIsTimerRunning(false);
    setHasStarted(false);
    setSecondsLeft(newMode === "timer" ? timerInput : 0);
  };

  const handleInputChange = (e) => {
    let val = parseInt(e.target.value) || 0;
    if (val > 10800) val = 10800;
    if (val < 1) val = 1;
    setTimerInput(val);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Navbar section */}
      <div className="flex items-center">
        {/* Main button to toggle dropdown */}
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-2 p-1 rounded hover:bg-base-300 text-base-content/70 hover:text-base-content"
        >
          {mode === "timer" ? (
            <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          {/* Show time only if started */}
          {hasStarted && (
            <span className="text-sm font-mono">{formatTime(secondsLeft)}</span>
          )}
        </button>

        {/* Show tiny buttons only if started */}
        {hasStarted && isTimerRunning && (
          <button
            onClick={() => setIsTimerRunning(false)}
            title="Pause"
            className="p-1 rounded hover:bg-base-300 text-base-content/70 hover:text-base-content"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
            </svg>
          </button>
        )}

        {hasStarted && !isTimerRunning && (
          <button
            onClick={() => setIsTimerRunning(true)}
            title="Resume"
            className="p-1 rounded hover:bg-base-300 text-base-content/70 hover:text-base-content"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-9 4h10a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
        )}
      </div>

      {/* Dropdown menu */}
      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-base-100 rounded-lg shadow-xl border border-base-300 p-4 z-[10003]">
          {/* Mode switch */}
          <div className="flex justify-between mb-4">
            <button
              onClick={() => handleModeChange("timer")}
              className={`flex-1 flex flex-col items-center gap-1 p-2 rounded-md border transition-colors ${
                mode === "timer"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-base-300 hover:bg-base-200"
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm">Timer</span>
            </button>
            <div className="w-2"></div>
            <button
              onClick={() => handleModeChange("stopwatch")}
              className={`flex-1 flex flex-col items-center gap-1 p-2 rounded-md border transition-colors ${
                mode === "stopwatch"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-base-300 hover:bg-base-200"
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm">Stopwatch</span>
            </button>
          </div>

          {/* Timer input */}
          {mode === "timer" && !isTimerRunning && !hasStarted && (
            <div className="mb-3">
              <label className="text-sm mb-1 block text-base-content">
                Set Timer (seconds, max 10800)
              </label>
              <input
                type="number"
                min={1}
                max={10800}
                value={timerInput}
                onChange={handleInputChange}
                className="input input-bordered input-sm w-full"
              />
            </div>
          )}

          {/* Start and Reset */}
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={toggleStartPause}
              className="btn btn-primary btn-sm flex-1"
            >
              {isTimerRunning ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
                  </svg>
                  Pause
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-9 4h10a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {hasStarted ? "Resume" : "Start"}
                </>
              )}
            </button>
            <button
              onClick={reset}
              className="btn btn-ghost btn-sm"
              title="Reset"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>

          <div className="mt-3 text-lg font-mono text-center text-base-content">
            {formatTime(secondsLeft)}
          </div>
        </div>
      )}
    </div>
  );
};

export default Timer;