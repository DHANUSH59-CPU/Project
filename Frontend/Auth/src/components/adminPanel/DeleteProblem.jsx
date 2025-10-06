import { useState, useEffect } from "react";
import axiosClient from "../../utils/axios";
import { useNavigate } from "react-router";

function DeleteProblem() {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingIds, setDeletingIds] = useState(new Set());

  useEffect(() => {
    fetchAllProblems();
  }, []);

  const fetchAllProblems = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get("/problem/allProblems");
      setProblems(response.data);
    } catch (error) {
      alert(
        `Error fetching problems: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (problemId, problemTitle) => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${problemTitle}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      setDeletingIds((prev) => new Set(prev).add(problemId));
      await axiosClient.delete(`/problem/delete/${problemId}`);
      setProblems(problems.filter((problem) => problem._id !== problemId));
      alert("Problem deleted successfully!");
    } catch (error) {
      alert(
        `Error deleting problem: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setDeletingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(problemId);
        return newSet;
      });
    }
  };

  const filteredProblems = problems.filter(
    (problem) =>
      problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      problem.difficulty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      problem.tags.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "text-success";
      case "medium":
        return "text-warning";
      case "hard":
        return "text-error";
      default:
        return "text-base-content";
    }
  };

  const getTagColor = (tag) => {
    switch (tag.toLowerCase()) {
      case "array":
        return "bg-orange-500/20 text-orange-500";
      case "linkedlist":
        return "bg-green-500/20 text-green-500";
      case "graph":
        return "bg-indigo-500/20 text-indigo-500";
      case "dp":
        return "bg-purple-500/20 text-purple-500";
      default:
        return "bg-gray-500/20 text-gray-500";
    }
  };

  return (
    <div className="container mx-auto p-6 min-h-screen bg-gradient-to-br from-base-200 to-base-300">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
          Delete Problem
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
        <p className="text-base-content/70 mt-4 text-lg">
          Remove coding problems from the platform
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="form-control">
          <div className="input-group">
            <input
              type="text"
              placeholder="Search problems by title, difficulty, or tag..."
              className="input input-bordered w-full focus:border-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-square btn-primary">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Problems List */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="loading loading-spinner loading-lg text-primary"></div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          <div className="grid gap-4">
            {filteredProblems.map((problem) => (
              <div
                key={problem._id}
                className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="card-body p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="card-title text-xl mb-2">
                        {problem.title}
                      </h3>
                      <p className="text-base-content/70 text-sm line-clamp-2 mb-4">
                        {problem.description}
                      </p>
                      <div className="flex items-center gap-3">
                        <span
                          className={`badge badge-lg font-semibold ${getDifficultyColor(
                            problem.difficulty
                          )}`}
                        >
                          {problem.difficulty.toUpperCase()}
                        </span>
                        <span
                          className={`badge badge-lg ${getTagColor(
                            problem.tags
                          )}`}
                        >
                          {problem.tags}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(problem._id, problem.title)}
                      disabled={deletingIds.has(problem._id)}
                      className={`btn btn-error btn-sm gap-2 ${
                        deletingIds.has(problem._id)
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      {deletingIds.has(problem._id) ? (
                        <>
                          <span className="loading loading-spinner loading-xs"></span>
                          Deleting...
                        </>
                      ) : (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          Delete
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProblems.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-base-content mb-2">
                No problems found
              </h3>
              <p className="text-base-content/70">
                Try adjusting your search terms.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Back Button */}
      <div className="text-center mt-8">
        <button
          onClick={() => navigate("/admin")}
          className="btn btn-outline btn-primary"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Admin Dashboard
        </button>
      </div>
    </div>
  );
}

export default DeleteProblem;
