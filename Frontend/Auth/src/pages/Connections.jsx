import React, { useEffect, useState } from "react";
import { Users, MessageCircle, Loader, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../store/connectionSlice";
import axiosClient from "../utils/axios";

const Connections = () => {
  const dispatch = useDispatch();
  const connections = useSelector((store) => store.connections);
  const user = useSelector((store) => store.authSlice.user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchConnections = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get("/discovery/connections");

      if (response.data.success) {
        dispatch(addConnections(response.data.data));
        setError(null);
      } else {
        throw new Error(response.data.error || "Failed to fetch connections");
      }
    } catch (err) {
      console.error("Error fetching connections:", err);
      setError(
        err.response?.data?.error ||
          err.message ||
          "Failed to fetch connections"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center p-8 bg-base-100/60 backdrop-blur-lg border border-purple-500/30 rounded-3xl shadow-2xl">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center animate-pulse">
            <Loader className="w-8 h-8 text-white animate-spin" />
          </div>
          <h3 className="text-xl font-semibold text-base-content mb-2">
            Loading Your Connections...
          </h3>
          <p className="text-base-content/70">Fetching your coding community</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center p-8 bg-error/10 border border-error/30 rounded-3xl shadow-2xl max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 bg-error/20 rounded-full flex items-center justify-center">
            <X className="w-8 h-8 text-error" />
          </div>
          <h3 className="text-xl font-semibold text-error mb-2">
            Error Loading Connections
          </h3>
          <p className="text-error/80 mb-4">{error}</p>
          <button
            onClick={fetchConnections}
            className="btn btn-outline btn-error"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div
              className="p-3 rounded-full bg-success/20 mr-4"
              style={{
                filter: "drop-shadow(0 4px 8px rgba(34, 197, 94, 0.3))",
              }}
            >
              <Users className="w-8 h-8 text-success" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Your Connections
            </h1>
          </div>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            Your network of fellow coders and programming partners
          </p>
        </div>

        {/* Connections List */}
        {!connections || connections.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-base-100/60 backdrop-blur-lg border border-purple-500/30 rounded-3xl shadow-2xl p-8 max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-base-content mb-2">
                No Connections Yet
              </h3>
              <p className="text-base-content/70 mb-4">
                Start discovering and connecting with fellow coders to build
                your network!
              </p>
              <button
                onClick={() => (window.location.href = "/discover")}
                className="btn bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white border-none rounded-2xl"
              >
                Discover Coders
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {connections.map((connection) => {
              // Extract the connected user data (the other user, not the current user)
              const connectedUser =
                connection.fromUserId._id === user._id
                  ? connection.toUserId
                  : connection.fromUserId;

              const {
                _id,
                firstName,
                lastName,
                profileImageUrl,
                age,
                problemsSolved,
              } = connectedUser;
              const avatarUrl =
                profileImageUrl ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  firstName + " " + lastName
                )}&background=6366f1&color=ffffff&size=200`;

              return (
                <div
                  key={_id}
                  className="bg-base-100/80 backdrop-blur-lg border border-success/20 rounded-2xl shadow-lg p-6 hover:border-success/40 transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="avatar">
                      <div className="w-16 h-16 rounded-full ring-2 ring-success/30">
                        <img
                          src={avatarUrl}
                          alt={`${firstName} ${lastName}`}
                          className="rounded-full object-cover"
                          onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              firstName + " " + lastName
                            )}&background=6366f1&color=ffffff&size=200`;
                          }}
                        />
                      </div>
                    </div>

                    {/* User Info */}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-base-content mb-1">
                        {firstName} {lastName}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-base-content/70">
                        <span className="flex items-center">
                          <svg
                            className="w-4 h-4 mr-1 text-success"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {problemsSolved || 0} problems solved
                        </span>
                        {age && (
                          <span className="flex items-center">
                            <svg
                              className="w-4 h-4 mr-1 text-info"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                            {age} years old
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          // For future chat implementation
                          console.log("Chat with:", _id);
                          alert("Chat feature coming soon!");
                        }}
                        className="btn bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white border-none rounded-xl px-4 py-2 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-purple-500/25"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span className="hidden sm:inline ml-2">Chat</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Connection Stats */}
        {connections && connections.length > 0 && (
          <div className="mt-8 text-center">
            <div className="bg-base-100/40 backdrop-blur-lg border border-success/20 rounded-2xl p-6 max-w-md mx-auto">
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-success/20 to-emerald-600/20 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-success" />
              </div>
              <p className="text-base-content/70">
                You have{" "}
                <span className="font-bold text-success">
                  {connections.length}
                </span>{" "}
                connection{connections.length !== 1 ? "s" : ""} in your coding
                network
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Connections;
