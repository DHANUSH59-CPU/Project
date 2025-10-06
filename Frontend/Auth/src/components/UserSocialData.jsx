import { useState, useEffect } from "react";
import { Heart, Bookmark, ExternalLink } from "lucide-react";
import axiosClient from "../utils/axios";
import { Link } from "react-router-dom";
import Loading from "./Loading";

const UserSocialData = ({ type = "liked" }) => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchProblems = async (pageNum = 1, reset = false) => {
    try {
      setLoading(true);
      const endpoint =
        type === "liked" ? "liked-problems" : "favorite-problems";
      const response = await axiosClient.get(`/social/user/${endpoint}`, {
        params: { page: pageNum, limit: 10 },
      });

      if (reset) {
        setProblems(
          response.data[type === "liked" ? "likedProblems" : "favoriteProblems"]
        );
      } else {
        setProblems((prev) => [
          ...prev,
          ...response.data[
            type === "liked" ? "likedProblems" : "favoriteProblems"
          ],
        ]);
      }

      setHasMore(response.data.pagination.hasNext);
    } catch (error) {
      console.error(`Error fetching ${type} problems:`, error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems(1, true);
  }, [type]);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return "badge-success";
      case "medium":
        return "badge-warning";
      case "hard":
        return "badge-error";
      default:
        return "badge-neutral";
    }
  };

  const getTagColor = (tag) => {
    const colors = {
      array: "bg-blue-100 text-blue-800",
      hashmap: "bg-purple-100 text-purple-800",
      linkedList: "bg-green-100 text-green-800",
      "breadth-first search": "bg-orange-100 text-orange-800",
      hashset: "bg-pink-100 text-pink-800",
      graph: "bg-indigo-100 text-indigo-800",
      search: "bg-yellow-100 text-yellow-800",
      queue: "bg-red-100 text-red-800",
      tree: "bg-teal-100 text-teal-800",
      string: "bg-cyan-100 text-cyan-800",
      recursion: "bg-amber-100 text-amber-800",
      stack: "bg-lime-100 text-lime-800",
      dp: "bg-rose-100 text-rose-800",
    };
    return colors[tag] || "bg-gray-100 text-gray-800";
  };

  if (loading && problems.length === 0) {
    return <Loading />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-6">
        {type === "liked" ? (
          <Heart className="w-6 h-6 text-red-500" />
        ) : (
          <Bookmark className="w-6 h-6 text-yellow-500" />
        )}
        <h2 className="text-2xl font-bold text-base-content">
          {type === "liked" ? "Liked Problems" : "Favorite Problems"}
        </h2>
      </div>

      {problems.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">{type === "liked" ? "💔" : "📚"}</div>
          <h3 className="text-xl font-semibold text-base-content mb-2">
            No {type} problems yet
          </h3>
          <p className="text-base-content/70 mb-4">
            {type === "liked"
              ? "Start liking problems to see them here!"
              : "Add problems to your favorites to see them here!"}
          </p>
          <Link to="/problems" className="btn btn-primary">
            Explore Problems
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {problems.map((problem) => (
            <div
              key={problem._id}
              className="bg-base-100 rounded-lg border border-base-300 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-base-content">
                      {problem.title}
                    </h3>
                    <span
                      className={`badge ${getDifficultyColor(
                        problem.difficulty
                      )}`}
                    >
                      {problem.difficulty}
                    </span>
                    <span className={`badge ${getTagColor(problem.tags)}`}>
                      {problem.tags}
                    </span>
                  </div>

                  <p className="text-base-content/70 mb-4 line-clamp-2">
                    {problem.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-base-content/70">
                      <div className="flex items-center space-x-1">
                        <Heart className="w-4 h-4" />
                        <span>{problem.likesCount || 0}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Bookmark className="w-4 h-4" />
                        <span>{problem.favoritesCount || 0}</span>
                      </div>
                    </div>

                    <Link
                      to={`/problems/${problem._id}`}
                      className="btn btn-primary btn-sm flex items-center space-x-1"
                    >
                      <span>Solve</span>
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {hasMore && (
            <div className="text-center mt-6">
              <button
                onClick={() => {
                  setPage((prev) => prev + 1);
                  fetchProblems(page + 1);
                }}
                disabled={loading}
                className="btn btn-ghost"
              >
                {loading ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserSocialData;
