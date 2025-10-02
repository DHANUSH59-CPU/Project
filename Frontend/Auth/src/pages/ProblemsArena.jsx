import React, { useEffect, useState } from "react";
import axiosClient from "../utils/axios";
import Loading from "../components/Loading";
import { useNavigate, useParams } from "react-router";
import { Heart, Bookmark, MessageCircle, RefreshCw } from "lucide-react";

const ProblemsArena = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    difficulty: "all",
    tag: "all",
  });

  // const { problemId } = useParams();

  const navigate = useNavigate();

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

  // Function to refresh problems data (can be called from other components)
  const refreshProblems = async () => {
    setLoading(true);
    await getAllProblems();
  };

  useEffect(() => {
    getAllProblems();
  }, []);

  // Filter problems based on selected filters
  const filteredProblems = problems.filter((problem) => {
    const difficultyMatch =
      filters.difficulty === "all" || problem.difficulty === filters.difficulty;
    const tagMatch = filters.tag === "all" || problem.tags === filters.tag;
    return difficultyMatch && tagMatch;
  });

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
      case "dp":
        return "bg-purple-600";
      case "graph":
        return "bg-indigo-500";
      default:
        return "bg-gray-500";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-xl font-semibold text-base-content">
        <Loading />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-base-content mb-2 text-center">
          Problems Arena
        </h1>
        <p className="text-base-content/70 text-center">
          Practice coding problems and improve your skills
        </p>

        {/* Scoring System Info */}
        <div className="mt-4 p-4 bg-base-200 rounded-lg border border-base-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-primary"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span className="font-semibold text-base-content">
                Point System:
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-success rounded-full"></span>
                <span className="text-base-content/70">
                  Easy:{" "}
                  <span className="font-semibold text-success">10 pts</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-warning rounded-full"></span>
                <span className="text-base-content/70">
                  Medium:{" "}
                  <span className="font-semibold text-warning">25 pts</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-error rounded-full"></span>
                <span className="text-base-content/70">
                  Hard: <span className="font-semibold text-error">50 pts</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6 p-4 bg-base-200 rounded-lg border border-base-300">
        <div className="flex items-center gap-2">
          <span className="text-base-content font-medium text-sm">
            Filter by:
          </span>
        </div>

        <select
          className="select select-bordered select-sm bg-base-100 text-base-content border-base-300 focus:border-primary focus:outline-none"
          value={filters.difficulty}
          onChange={(e) =>
            setFilters({ ...filters, difficulty: e.target.value })
          }
        >
          <option value="all">All Difficulties</option>
          <option value="easy">🟢 Easy</option>
          <option value="medium">🟡 Medium</option>
          <option value="hard">🔴 Hard</option>
        </select>

        <select
          className="select select-bordered select-sm bg-base-100 text-base-content border-base-300 focus:border-primary focus:outline-none"
          value={filters.tag}
          onChange={(e) => setFilters({ ...filters, tag: e.target.value })}
        >
          <option value="all">All Categories</option>
          <option value="array">📊 Array</option>
          <option value="dp">⚡ Dynamic Programming</option>
          <option value="graph">🌐 Graph</option>
          <option value="linkedList">🔗 Linked List</option>
        </select>

        {/* Filter Results Count and Refresh Button */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={refreshProblems}
            className="btn btn-ghost btn-sm"
            title="Refresh social counts"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <span className="text-base-content/70 text-sm">
            Showing {filteredProblems.length} of {problems.length} problems
          </span>
        </div>
      </div>

      {/* Problems List */}
      {filteredProblems.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-base-content mb-2">
            No problems found
          </h3>
          <p className="text-base-content/70">
            Try adjusting your filters to see more problems.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {filteredProblems.map((problem, index) => (
            <li
              key={problem._id}
              className="flex justify-between items-center bg-base-100 p-4 rounded-lg hover:bg-base-200 transition-all duration-200 border border-base-300 hover:border-primary/30 hover:shadow-md cursor-pointer group"
              onClick={() => navigate(`/problems/${problem._id}`)}
            >
              {/* Left: dot + title + tag */}
              <div className="flex items-center gap-3">
                <span
                  className={`w-3 h-3 rounded-full ${getTagColor(
                    problem.tags
                  )} group-hover:scale-110 transition-transform duration-200`}
                ></span>
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
                  <span className="font-medium text-base-content group-hover:text-primary transition-colors duration-200">
                    {problem.title}
                  </span>
                  <span className="text-xs text-base-content/60 capitalize bg-base-200 px-2 py-1 rounded-full">
                    {problem.tags}
                  </span>
                </div>
              </div>

              {/* Right: social data + difficulty */}
              <div className="flex items-center gap-3">
                {/* Social Stats */}
                <div className="flex items-center gap-3 text-sm text-base-content/60">
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    <span>{problem.likesCount || 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bookmark className="w-4 h-4" />
                    <span>{problem.favoritesCount || 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    <span>{problem.commentsCount || 0}</span>
                  </div>
                </div>

                <span
                  className={`font-semibold text-sm capitalize px-3 py-1 rounded-full ${
                    problem.difficulty === "easy"
                      ? "bg-success/20 text-success"
                      : problem.difficulty === "medium"
                      ? "bg-warning/20 text-warning"
                      : "bg-error/20 text-error"
                  }`}
                >
                  {problem.difficulty}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProblemsArena;
