import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Clock, Timer as TimerIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Timer = ({isTimerRunning, setIsTimerRunning}) => {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("timer"); // "stopwatch" or "timer"
  
  const [hasStarted, setHasStarted] = useState(false); // ✅ new state
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
  }, [isTimerRunning, mode]);

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
      setHasStarted(true); // ✅ mark as started
    }
  };

  const reset = () => {
    clearInterval(intervalRef.current);
    setIsTimerRunning(false);
    setHasStarted(false); // hide time again
    setSecondsLeft(mode === "timer" ? timerInput : 0);
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setIsTimerRunning(false);
    setHasStarted(false); // hide time again
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
          className="flex items-center gap-2 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          {mode === "timer" ? (
            <TimerIcon size={18} className="text-blue-500" />
          ) : (
            <Clock size={18} className="text-blue-500" />
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
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <Pause size={16} className="text-blue-500" />
          </button>
        )}

        {hasStarted && !isTimerRunning && (
          <button
            onClick={() => setIsTimerRunning(true)}
            title="Resume"
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <Play size={16} className="text-blue-500" />
          </button>
        )}
      </div>

      {/* Dropdown menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="dropdown"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow-lg p-4 z-50"
          >
            {/* Mode switch */}
            <div className="flex justify-between mb-4">
              <button
                onClick={() => handleModeChange("timer")}
                className={`flex-1 flex flex-col items-center gap-1 p-2 rounded-md border ${
                  mode === "timer"
                    ? "border-orange-500 bg-orange-50 dark:bg-gray-700"
                    : "border-transparent hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <TimerIcon
                  size={24}
                  className={
                    mode === "timer" ? "text-orange-500" : "text-gray-400"
                  }
                />
                <span className="text-sm">Timer</span>
              </button>
              <div className="w-2"></div>
              <button
                onClick={() => handleModeChange("stopwatch")}
                className={`flex-1 flex flex-col items-center gap-1 p-2 rounded-md border ${
                  mode === "stopwatch"
                    ? "border-blue-500 bg-blue-50 dark:bg-gray-700"
                    : "border-transparent hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <Clock
                  size={24}
                  className={
                    mode === "stopwatch" ? "text-blue-500" : "text-gray-400"
                  }
                />
                <span className="text-sm">Stopwatch</span>
              </button>
            </div>

            {/* Timer input */}
            {mode === "timer" && !isTimerRunning && !hasStarted && (
              <div className="mb-3">
                <label className="text-sm mb-1 block">
                  Set Timer (seconds, max 10800)
                </label>
                <input
                  type="number"
                  min={1}
                  max={10800}
                  value={timerInput}
                  onChange={handleInputChange}
                  className="w-full rounded-md p-2 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-black dark:text-white text-sm"
                />
              </div>
            )}

            {/* Start and Reset */}
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={toggleStartPause}
                className="flex items-center justify-center gap-2 flex-1 py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white font-medium"
              >
                {isTimerRunning ? <Pause size={18} /> : <Play size={18} />}
                {isTimerRunning ? "Pause" : hasStarted ? "Resume" : "Start"}
              </button>
              <button
                onClick={reset}
                className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                title="Reset"
              >
                <RotateCcw size={18} />
              </button>
            </div>

            <div className="mt-3 text-lg font-mono text-center">
              {formatTime(secondsLeft)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Timer;
