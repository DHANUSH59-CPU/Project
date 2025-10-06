import React, { useState, useEffect } from "react";
import { Search, Users, Loader } from "lucide-react";
import UserCard from "../components/UserCard";
import axiosClient from "../utils/axios";
import { useDispatch, useSelector } from "react-redux";
import { addFeed, removeUserFromFeed } from "../store/discoverySlice";

const DiscoverFriends = () => {
  const dispatch = useDispatch();
  const feed = useSelector((store) => store.discovery);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch discoverable users
  const fetchFeed = async () => {
    if (feed) return; // Don't fetch if feed already exists

    try {
      setLoading(true);
      const response = await axiosClient.get(
        `/discovery/users?page=1&limit=50`
      );

      if (response.data.success) {
        dispatch(addFeed(response.data.data));
        setError(null);
      } else {
        throw new Error(response.data.error || "Failed to fetch users");
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(
        err.response?.data?.error || err.message || "Failed to fetch users"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  return (
    <div className="min-h-screen bg-base-200 relative">
      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        {feed && feed.length > 0 ? (
          <div className="w-full max-w-md">
            <UserCard user={feed[0]} />
          </div>
        ) : loading ? (
          <div className="text-center p-8 bg-base-100/60 backdrop-blur-lg border border-purple-500/30 rounded-3xl shadow-2xl">
            <div className="mb-4">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center animate-pulse">
                <Loader className="w-8 h-8 text-white animate-spin" />
              </div>
              <h3 className="text-xl font-semibold text-base-content mb-2">
                Finding Amazing Coders...
              </h3>
              <p className="text-base-content/70">
                Scanning the community for potential connections
              </p>
            </div>
            <div className="flex justify-center space-x-1">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        ) : error ? (
          <div className="text-center p-8 bg-error/10 border border-error/30 rounded-3xl shadow-2xl">
            <div className="w-16 h-16 mx-auto mb-4 bg-error/20 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-error"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-error mb-2">
              Oops! Something went wrong
            </h3>
            <p className="text-error/80 mb-4">{error}</p>
            <button onClick={fetchFeed} className="btn btn-outline btn-error">
              Try Again
            </button>
          </div>
        ) : (
          <div className="text-center p-8 bg-base-100/60 backdrop-blur-lg border border-purple-500/30 rounded-3xl shadow-2xl">
            <div className="mb-4">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-base-content mb-2">
                No More Coders Found
              </h3>
              <p className="text-base-content/70">
                You've discovered all available coders! Check back later for new
                members.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscoverFriends;
