import React, { useEffect, useState } from "react";
import { Users, Check, X, Loader } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "../store/requestSlice";
import axiosClient from "../utils/axios";

const ConnectionRequests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((store) => store.requests);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get("/discovery/requests/received");

      if (response.data.success) {
        dispatch(addRequests(response.data.data));
        setError(null);
      } else {
        throw new Error(response.data.error || "Failed to fetch requests");
      }
    } catch (err) {
      console.error("Error fetching requests:", err);
      setError(
        err.response?.data?.error || err.message || "Failed to fetch requests"
      );
    } finally {
      setLoading(false);
    }
  };

  const reviewRequest = async (status, userId, requestId) => {
    try {
      setProcessingId(requestId);
      const response = await axiosClient.post(
        `/discovery/request/review/${status}/${userId}`
      );

      if (response.data.success) {
        dispatch(removeRequest(requestId));
      } else {
        throw new Error(response.data.error || "Failed to review request");
      }
    } catch (err) {
      console.error("Error reviewing request:", err);
      setError(
        err.response?.data?.error || err.message || "Failed to review request"
      );
    } finally {
      setProcessingId(null);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center p-8 bg-base-100/60 backdrop-blur-lg border border-purple-500/30 rounded-3xl shadow-2xl">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center animate-pulse">
            <Loader className="w-8 h-8 text-white animate-spin" />
          </div>
          <h3 className="text-xl font-semibold text-base-content mb-2">
            Loading Connection Requests...
          </h3>
          <p className="text-base-content/70">Fetching your pending requests</p>
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
            Error Loading Requests
          </h3>
          <p className="text-error/80 mb-4">{error}</p>
          <button onClick={fetchRequests} className="btn btn-outline btn-error">
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
              className="p-3 rounded-full bg-info/20 mr-4"
              style={{
                filter: "drop-shadow(0 4px 8px rgba(59, 130, 246, 0.3))",
              }}
            >
              <Users className="w-8 h-8 text-info" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Connection Requests
            </h1>
          </div>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            Review and manage your pending connection requests from fellow
            coders
          </p>
        </div>

        {/* Requests List */}
        {!requests || requests.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-base-100/60 backdrop-blur-lg border border-purple-500/30 rounded-3xl shadow-2xl p-8 max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-base-content mb-2">
                No Pending Requests
              </h3>
              <p className="text-base-content/70">
                You don't have any connection requests at the moment. Check back
                later!
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => {
              const {
                _id,
                firstName,
                lastName,
                profileImageUrl,
                age,
                problemsSolved,
              } = request.fromUserId;
              const avatarUrl =
                profileImageUrl ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  firstName + " " + lastName
                )}&background=6366f1&color=ffffff&size=200`;

              return (
                <div
                  key={request._id}
                  className="bg-base-100/80 backdrop-blur-lg border border-purple-500/20 rounded-2xl shadow-lg p-6 hover:border-purple-400/40 transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="avatar">
                      <div className="w-16 h-16 rounded-full ring-2 ring-purple-400/30">
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
                            className="w-4 h-4 mr-1 text-purple-400"
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
                              className="w-4 h-4 mr-1 text-indigo-400"
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

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={() =>
                          reviewRequest("rejected", _id, request._id)
                        }
                        disabled={processingId === request._id}
                        className={`btn bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-400 hover:to-pink-400 text-white border-none rounded-xl px-4 py-2 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-red-500/25 ${
                          processingId === request._id
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        {processingId === request._id ? (
                          <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                          <X className="w-4 h-4" />
                        )}
                        <span className="hidden sm:inline ml-2">Reject</span>
                      </button>

                      <button
                        onClick={() =>
                          reviewRequest("accepted", _id, request._id)
                        }
                        disabled={processingId === request._id}
                        className={`btn bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white border-none rounded-xl px-4 py-2 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-green-500/25 ${
                          processingId === request._id
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        {processingId === request._id ? (
                          <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                          <Check className="w-4 h-4" />
                        )}
                        <span className="hidden sm:inline ml-2">Accept</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectionRequests;
