import { useState, useEffect } from "react";
import axiosClient from "../utils/axios";
import toast from "react-hot-toast";

const SocialActions = ({
  problemId,
  initialLikesCount = 0,
  initialFavoritesCount = 0,
  initialCommentsCount = 0,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [favoritesCount, setFavoritesCount] = useState(initialFavoritesCount);
  const [commentsCount, setCommentsCount] = useState(initialCommentsCount);
  const [loading, setLoading] = useState(false);

  // Fetch initial social status
  useEffect(() => {
    const fetchSocialStatus = async () => {
      try {
        const response = await axiosClient.get(
          `/social/problems/${problemId}/status`
        );
        setIsLiked(response.data.isLiked);
        setIsFavorited(response.data.isFavorited);
      } catch (error) {
        console.error("Error fetching social status:", error);
      }
    };

    if (problemId) {
      fetchSocialStatus();
    }
  }, [problemId]);

  const handleLike = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await axiosClient.post(
        `/social/problems/${problemId}/like`
      );
      setIsLiked(response.data.isLiked);
      setLikesCount(response.data.likesCount);

      if (response.data.isLiked) {
        toast.success("Problem liked!");
      } else {
        toast.success("Problem unliked!");
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      toast.error("Failed to update like status");
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await axiosClient.post(
        `/social/problems/${problemId}/favorite`
      );
      setIsFavorited(response.data.isFavorited);
      setFavoritesCount(response.data.favoritesCount);

      if (response.data.isFavorited) {
        toast.success("Added to favorites!");
      } else {
        toast.success("Removed from favorites!");
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Failed to update favorite status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-4 p-4 bg-base-100 border-t border-base-300">
      {/* Like Button */}
      <button
        onClick={handleLike}
        disabled={loading}
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
          isLiked
            ? "bg-red-100 text-red-600 hover:bg-red-200 shadow-md"
            : "bg-base-200 text-base-content hover:bg-base-300 hover:shadow-md"
        } ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        style={{
          transform: isLiked ? "scale(1.05)" : "scale(1)",
          transition: "all 0.2s ease",
        }}
      >
        <svg
          className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`}
          viewBox="0 0 24 24"
          style={{
            filter: isLiked
              ? "drop-shadow(0 2px 4px rgba(239, 68, 68, 0.4))"
              : "drop-shadow(0 1px 2px rgba(0,0,0,0.2))",
          }}
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
        <span className="text-sm font-medium">{likesCount}</span>
      </button>

      {/* Favorite Button */}
      <button
        onClick={handleFavorite}
        disabled={loading}
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
          isFavorited
            ? "bg-yellow-100 text-yellow-600 hover:bg-yellow-200 shadow-md"
            : "bg-base-200 text-base-content hover:bg-base-300 hover:shadow-md"
        } ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        style={{
          transform: isFavorited ? "scale(1.05)" : "scale(1)",
          transition: "all 0.2s ease",
        }}
      >
        <svg
          className={`w-5 h-5 ${isFavorited ? "fill-current" : ""}`}
          viewBox="0 0 24 24"
          style={{
            filter: isFavorited
              ? "drop-shadow(0 2px 4px rgba(245, 158, 11, 0.4))"
              : "drop-shadow(0 1px 2px rgba(0,0,0,0.2))",
          }}
        >
          <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
        <span className="text-sm font-medium">{favoritesCount}</span>
      </button>

      {/* Comments Count (Display only) */}
      <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-base-200 text-base-content hover:bg-base-300 transition-all duration-200">
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 24 24"
          style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.2))" }}
        >
          <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
        </svg>
        <span className="text-sm font-medium">{commentsCount}</span>
      </div>
    </div>
  );
};

export default SocialActions;
