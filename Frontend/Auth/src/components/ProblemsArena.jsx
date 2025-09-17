import React, { useEffect, useState } from "react";
import axiosClient from "../utils/axios";

const ProblemsArena = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAllProblems = async () => {
    try {
      const response = await axiosClient.get("/problem/allProblems");
      setProblems(response.data);
    } catch (err) {
      console.error("Error fetching problems:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllProblems();
  }, []);

  // utility: map difficulty → color
  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "text-green-500";
      case "medium":
        return "text-yellow-400";
      case "hard":
        return "text-red-500";
      default:
        return "text-gray-400";
    }
  };

  // utility: map tags → dot color
  const getTagColor = (tag) => {
    switch (tag.toLowerCase()) {
      case "array":
        return "bg-orange-500";
      case "string":
        return "bg-blue-500";
      case "linkedlist":
        return "bg-green-500";
      case "stack":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-xl font-semibold">
        Loading problems...
      </div>
    );
  }

  return (
    <div className="p-4">
      <ul className="space-y-2">
        {problems.map((problem) => (
          <li
            key={problem._id}
            className="flex justify-between items-center bg-base-200 p-3 rounded-lg hover:bg-base-300 transition"
          >
            {/* Left: dot + title + tag */}
            <div className="flex items-center gap-2">
              <span
                className={`w-3 h-3 rounded-full ${getTagColor(problem.tags)}`}
              ></span>
              <span className="font-medium">{problem.title}</span>
              <span className="ml-1 text-xs text-gray-400">{problem.tags}</span>
            </div>

            {/* Right: difficulty */}
            <div
              className={`font-semibold ${getDifficultyColor(
                problem.difficulty
              )}`}
            >
              {problem.difficulty}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProblemsArena;
