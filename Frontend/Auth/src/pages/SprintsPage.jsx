import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  Clock,
  Users,
  Trophy,
  Star,
  ChevronRight,
} from "lucide-react";
import axiosClient from "../utils/axios";
import Loading from "../components/Loading";

const SprintsPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sprints, setSprints] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    category: "",
    difficulty: "",
    search: "",
  });

  const categories = [
    "Arrays",
    "Strings",
    "Dynamic Programming",
    "Graphs",
    "Trees",
    "Sorting",
    "Searching",
    "Greedy",
    "Backtracking",
    "Math",
    "Bit Manipulation",
    "Two Pointers",
    "Sliding Window",
    "Stack",
    "Queue",
    "Hash Table",
    "Linked List",
    "Binary Search",
    "Recursion",
  ];

  const difficulties = ["Beginner", "Intermediate", "Advanced"];

  useEffect(() => {
    fetchSprints();
  }, [currentPage, filters]);

  const fetchSprints = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 12,
        ...filters,
      });

      const response = await axiosClient.get(`/sprint?${params}`);
      setSprints(response.data.sprints);
      setTotalPages(response.data.pagination.totalPages);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching sprints:", error);
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner":
        return "text-green-500 bg-green-100";
      case "Intermediate":
        return "text-yellow-500 bg-yellow-100";
      case "Advanced":
        return "text-red-500 bg-red-100";
      default:
        return "text-gray-500 bg-gray-100";
    }
  };

  const getCategoryIcon = (category) => {
    const iconMap = {
      Arrays: "📊",
      Strings: "📝",
      "Dynamic Programming": "🧠",
      Graphs: "🕸️",
      Trees: "🌳",
      Sorting: "🔄",
      Searching: "🔍",
      Greedy: "💰",
      Backtracking: "🔙",
      Math: "🔢",
      "Bit Manipulation": "⚡",
      "Two Pointers": "👆",
      "Sliding Window": "🪟",
      Stack: "📚",
      Queue: "🚶",
      "Hash Table": "🗂️",
      "Linked List": "🔗",
      "Binary Search": "🔍",
      Recursion: "🔄",
    };
    return iconMap[category] || "📋";
  };

  const formatTime = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-base-200 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-base-content mb-4">
            🏃‍♂️ Sprints
          </h1>
          <p className="text-lg text-base-content/70">
            Structured learning paths to master coding concepts
          </p>
        </div>

        {/* Filters */}
        <div className="bg-base-100 rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 w-4 h-4" />
              <input
                type="text"
                placeholder="Search sprints..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-base-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            {/* Category Filter */}
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange("category", e.target.value)}
              className="px-4 py-2 border border-base-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {getCategoryIcon(category)} {category}
                </option>
              ))}
            </select>

            {/* Difficulty Filter */}
            <select
              value={filters.difficulty}
              onChange={(e) => handleFilterChange("difficulty", e.target.value)}
              className="px-4 py-2 border border-base-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="">All Difficulties</option>
              {difficulties.map((difficulty) => (
                <option key={difficulty} value={difficulty}>
                  {difficulty}
                </option>
              ))}
            </select>

            {/* Clear Filters */}
            <button
              onClick={() =>
                setFilters({ category: "", difficulty: "", search: "" })
              }
              className="px-4 py-2 bg-base-300 text-base-content rounded-lg hover:bg-base-300/80 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Sprints Grid */}
        {sprints.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏃‍♂️</div>
            <h3 className="text-xl font-semibold text-base-content mb-2">
              No Sprints Found
            </h3>
            <p className="text-base-content/70">
              {Object.values(filters).some((f) => f)
                ? "Try adjusting your filters to see more sprints."
                : "No sprints are available yet. Check back later!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sprints.map((sprint) => (
              <div
                key={sprint._id}
                className="bg-base-100 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Sprint Header */}
                <div className="p-6 border-b border-base-300">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">
                        {getCategoryIcon(sprint.category)}
                      </span>
                      <div>
                        <h3 className="font-semibold text-base-content">
                          {sprint.title}
                        </h3>
                        <p className="text-sm text-base-content/70">
                          {sprint.category}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                        sprint.difficulty
                      )}`}
                    >
                      {sprint.difficulty}
                    </span>
                  </div>

                  <p className="text-sm text-base-content/70 mb-4 line-clamp-2">
                    {sprint.description}
                  </p>

                  {/* Sprint Stats */}
                  <div className="flex items-center justify-between text-sm text-base-content/60">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatTime(sprint.estimatedTime)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{sprint.problemCount} problems</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4" />
                      <span>{sprint.points} pts</span>
                    </div>
                  </div>
                </div>

                {/* User Progress */}
                {sprint.userProgress && (
                  <div className="px-6 py-3 bg-base-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-base-content">
                        Your Progress
                      </span>
                      <span className="text-sm text-base-content/70">
                        {sprint.userProgress.progressPercentage}%
                      </span>
                    </div>
                    <div className="w-full bg-base-300 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${sprint.userProgress.progressPercentage}%`,
                        }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between mt-2 text-xs text-base-content/60">
                      <span>
                        {sprint.userProgress.problemsSolvedCount} solved
                      </span>
                      <span
                        className={
                          sprint.userProgress.isCompleted
                            ? "text-green-500"
                            : "text-yellow-500"
                        }
                      >
                        {sprint.userProgress.isCompleted
                          ? "Completed"
                          : "In Progress"}
                      </span>
                    </div>
                  </div>
                )}

                {/* Sprint Footer */}
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {sprint.tags?.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-base-300 text-xs rounded-full text-base-content/70"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={() => navigate(`/sprint/${sprint._id}`)}
                      className="btn btn-primary btn-sm"
                    >
                      {sprint.userProgress?.isCompleted ? "View" : "Start"}
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="btn btn-outline btn-sm"
              >
                Previous
              </button>

              <span className="px-4 py-2 text-sm text-base-content/70">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                className="btn btn-outline btn-sm"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SprintsPage;
