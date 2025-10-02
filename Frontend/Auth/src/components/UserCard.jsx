import React, { useState } from "react";
import { Trophy } from "lucide-react";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../store/discoverySlice";
import axiosClient from "../utils/axios";

const UserCard = ({ user }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  const showToastMessage = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handleSendRequest = async (status, userId) => {
    setIsLoading(true);

    try {
      const response = await axiosClient.post(
        `/discovery/request/send/${status}/${userId}`
      );

      if (response.data.success) {
        // Show success message
        const message =
          status === "interested" ? "Connection request sent!" : "User ignored";
        showToastMessage(message, "success");

        // Remove from feed immediately
        dispatch(removeUserFromFeed(userId));
      } else {
        throw new Error(response.data.error || "Failed to send request");
      }
    } catch (err) {
      console.error("Error sending request:", err);
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to send request. Please try again.";
      showToastMessage(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Default avatar if no profile image
  const avatarUrl =
    user.profileImageUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user.firstName + " " + user.lastName
    )}&background=6366f1&color=ffffff&size=200`;

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <div className="relative group">
        {/* Main card - Using current dark theme pattern */}
        <div
          className="card bg-base-100/80 backdrop-blur-sm shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 hover:border-primary/30 hover:-translate-y-1 relative z-10 w-80 rounded-2xl overflow-hidden"
          style={{
            backdropFilter: "blur(10px)",
          }}
        >
          <figure className="px-6 pt-6">
            <div className="relative">
              <img
                src={avatarUrl}
                alt={`${user.firstName} ${user.lastName}`}
                className="rounded-xl w-full h-40 object-cover border border-white/10 group-hover:border-white/20 transition-all duration-300"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user.firstName + " " + user.lastName
                  )}&background=6366f1&color=ffffff&size=200`;
                }}
              />
            </div>
          </figure>

          <div className="card-body items-center text-center px-6 pb-6">
            {/* Name */}
            <h2 className="card-title text-xl font-bold text-base-content mb-2">
              {`${user.firstName} ${user.lastName}`}
            </h2>

            {/* Problems Solved */}
            <div className="flex items-center space-x-2 mb-3 px-3 py-2 bg-base-200/50 rounded-lg border border-white/10">
              <Trophy className="w-4 h-4 text-primary" />
              <span className="text-sm text-base-content">
                <span className="font-bold text-primary">
                  {user.problemsSolved || 0}
                </span>{" "}
                problems solved
              </span>
            </div>

            {/* Member since */}
            {user.createdAt && (
              <p className="text-xs text-base-content/60 mb-4">
                Member since{" "}
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                })}
              </p>
            )}

            {/* Action buttons */}
            <div className="card-actions justify-center mt-4 gap-3 w-full">
              <button
                onClick={() => handleSendRequest("ignored", user._id)}
                disabled={isLoading}
                className={`btn btn-error rounded-xl px-6 py-2 transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  <>
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    Pass
                  </>
                )}
              </button>

              <button
                onClick={() => handleSendRequest("interested", user._id)}
                disabled={isLoading}
                className={`btn btn-primary rounded-xl px-6 py-2 transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  <>
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
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    Connect
                  </>
                )}
              </button>
            </div>

            {/* Status indicator */}
            <div className="flex items-center justify-center mt-4 gap-2 text-xs text-base-content/60">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span>Active Coder</span>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-[9999]">
          <div
            className={`backdrop-blur-xl border rounded-2xl shadow-2xl px-6 py-4 flex items-center space-x-3 animate-in slide-in-from-top-2 duration-300 ${
              toastType === "success"
                ? "bg-green-900/80 border-green-400/30 text-green-300 shadow-green-500/20"
                : "bg-red-900/80 border-red-400/30 text-red-300 shadow-red-500/20"
            }`}
          >
            <svg
              className={`w-6 h-6 ${
                toastType === "success" ? "text-green-400" : "text-red-400"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {toastType === "success" ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              )}
            </svg>
            <span className="font-medium">{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserCard;
