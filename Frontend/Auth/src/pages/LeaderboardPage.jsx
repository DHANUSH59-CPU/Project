import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import axiosClient from "../utils/axios";
import Loading from "../components/Loading";

const LeaderboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [leaderboardData, setLeaderboardData] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  const USERS_PER_PAGE = 10;

  useEffect(() => {
    fetchLeaderboardData();
  }, [currentPage]);

  const fetchLeaderboardData = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get(
        `/leaderboard?page=${currentPage}&limit=${USERS_PER_PAGE}`
      );
      setLeaderboardData(response.data);
      setUserStats(response.data.user);
      setTotalPages(response.data.pagination.totalPages);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      console.error("Error response:", error.response?.data);
      setLoading(false);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // 3D Minimalist Icons Components
  const Crown3D = () => (
    <svg
      className="w-5 h-5"
      viewBox="0 0 24 24"
      style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.15))" }}
    >
      <defs>
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FCD34D" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
      </defs>
      <path
        d="M5 16L3 6l5.5 4L12 4l3.5 6L21 6l-2 10H5z"
        fill="url(#goldGradient)"
      />
      <path
        d="M5 16L3 6l5.5 4L12 4l3.5 6L21 6l-2 10H5z"
        fill="none"
        stroke="rgba(245, 158, 11, 0.3)"
        strokeWidth="0.5"
      />
    </svg>
  );

  const Trophy3D = ({ color = "silver" }) => (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      style={{ filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.12))" }}
    >
      <defs>
        <linearGradient
          id={`${color}Gradient`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          {color === "silver" ? (
            <>
              <stop offset="0%" stopColor="#E5E7EB" />
              <stop offset="100%" stopColor="#9CA3AF" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#FED7AA" />
              <stop offset="100%" stopColor="#EA580C" />
            </>
          )}
        </linearGradient>
      </defs>
      <path
        d="M7 4V2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v2h1a1 1 0 0 1 1 1v5a3 3 0 0 1-3 3v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2a3 3 0 0 1-3-3V5a1 1 0 0 1 1-1h1z"
        fill={`url(#${color}Gradient)`}
      />
      <rect
        x="9"
        y="17"
        width="6"
        height="2"
        fill={color === "silver" ? "#9CA3AF" : "#EA580C"}
      />
    </svg>
  );

  const Star3D = () => (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      style={{ filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.12))" }}
    >
      <defs>
        <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FCD34D" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
      </defs>
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        fill="url(#starGradient)"
      />
    </svg>
  );

  // Additional 3D Icons for User Stats
  const RankBadge3D = () => (
    <svg
      className="w-8 h-8"
      viewBox="0 0 24 24"
      style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }}
    >
      <defs>
        <linearGradient id="rankGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1E40AF" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="10" fill="url(#rankGradient)" />
      <circle
        cx="12"
        cy="12"
        r="8"
        fill="none"
        stroke="rgba(59, 130, 246, 0.3)"
        strokeWidth="0.5"
      />
      <text
        x="12"
        y="16"
        textAnchor="middle"
        fontSize="8"
        fill="white"
        fontWeight="bold"
      >
        #
      </text>
    </svg>
  );

  const PointsIcon3D = () => (
    <svg
      className="w-8 h-8"
      viewBox="0 0 24 24"
      style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }}
    >
      <defs>
        <linearGradient id="pointsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>
      <polygon
        points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
        fill="url(#pointsGradient)"
      />
    </svg>
  );

  const SolvedIcon3D = () => (
    <svg
      className="w-8 h-8"
      viewBox="0 0 24 24"
      style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }}
    >
      <defs>
        <linearGradient id="solvedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
      </defs>
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="3"
        fill="url(#solvedGradient)"
      />
      <path
        d="M9 12l2 2 4-4"
        stroke="white"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const StreakIcon3D = () => (
    <svg
      className="w-8 h-8"
      viewBox="0 0 24 24"
      style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }}
    >
      <defs>
        <linearGradient id="streakGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F97316" />
          <stop offset="50%" stopColor="#EA580C" />
          <stop offset="100%" stopColor="#DC2626" />
        </linearGradient>
      </defs>
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="url(#streakGradient)" />
    </svg>
  );

  const getPodiumIcon = (rank) => {
    if (rank === 1) return <Crown3D />;
    if (rank === 2) return <Trophy3D color="silver" />;
    if (rank === 3) return <Trophy3D color="bronze" />;
    return null;
  };

  const getRankColor = (rank) => {
    if (rank === 1) return "text-yellow-500";
    if (rank === 2) return "text-gray-400";
    if (rank === 3) return "text-orange-500";
    return "text-base-content";
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-base-200 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-base-content mb-4">
            Leaderboard
          </h1>
          <p className="text-lg text-base-content/70">
            See where you stand among the best coders on our platform
          </p>
        </div>

        {/* User's Current Standing */}
        {userStats && (
          <div className="bg-base-100 rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">
              Your Current Standing
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center group">
                <div className="flex flex-col items-center space-y-2">
                  <div className="transform transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1">
                    <RankBadge3D />
                  </div>
                  <div className="text-3xl font-bold text-primary transition-all duration-300 group-hover:text-blue-600">
                    #{userStats.rank}
                  </div>
                  <div className="text-sm text-base-content/70">Rank</div>
                </div>
              </div>
              <div className="text-center group">
                <div className="flex flex-col items-center space-y-2">
                  <div className="transform transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1 group-hover:rotate-12">
                    <PointsIcon3D />
                  </div>
                  <div className="text-3xl font-bold text-secondary transition-all duration-300 group-hover:text-green-600">
                    {userStats.points}
                  </div>
                  <div className="text-sm text-base-content/70">Points</div>
                </div>
              </div>
              <div className="text-center group">
                <div className="flex flex-col items-center space-y-2">
                  <div className="transform transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1">
                    <SolvedIcon3D />
                  </div>
                  <div className="text-3xl font-bold text-accent transition-all duration-300 group-hover:text-purple-600">
                    {userStats.solvedCount}
                  </div>
                  <div className="text-sm text-base-content/70">
                    Problems Solved
                  </div>
                </div>
              </div>
              <div className="text-center group">
                <div className="flex flex-col items-center space-y-2">
                  <div className="transform transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1 group-hover:rotate-6">
                    <StreakIcon3D />
                  </div>
                  <div className="text-3xl font-bold text-info transition-all duration-300 group-hover:text-orange-600">
                    {userStats.streaks?.current || 0}
                  </div>
                  <div className="text-sm text-base-content/70">
                    Current Streak
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard Table */}
        <div className="bg-base-100 rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-base-300">
            <h2 className="text-xl font-semibold text-base-content">
              Global Leaderboard
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="border-b border-base-300">
                  <th className="text-left py-4 px-6">Rank</th>
                  <th className="text-left py-4 px-6">User</th>
                  <th className="text-right py-4 px-6">Points</th>
                  <th className="text-right py-4 px-6">Solved</th>
                </tr>
              </thead>
              <tbody>
                {leaderboardData?.leaderboard?.map((user, index) => (
                  <tr
                    key={user._id}
                    className={`border-b border-base-300 hover:bg-base-200 transition-all duration-200 ${
                      user.rank <= 3
                        ? "bg-gradient-to-r from-transparent to-base-100 hover:from-base-100 hover:to-base-200"
                        : ""
                    }`}
                    style={{
                      boxShadow:
                        user.rank <= 3 ? "0 1px 3px rgba(0,0,0,0.05)" : "none",
                    }}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2 group">
                        <div className="transform transition-all duration-200 group-hover:scale-110">
                          {getPodiumIcon(user.rank)}
                        </div>
                        <span
                          className={`font-semibold ${getRankColor(
                            user.rank
                          )} transition-all duration-200`}
                          style={{
                            textShadow:
                              user.rank <= 3
                                ? "0 1px 2px rgba(0,0,0,0.1)"
                                : "none",
                          }}
                        >
                          #{user.rank}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="avatar">
                          <div className="w-10 h-10 rounded-full">
                            <img
                              src={
                                user.profileImageUrl ||
                                "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                              }
                              alt={user.firstName}
                              className="rounded-full"
                            />
                          </div>
                        </div>
                        <div>
                          <div className="font-medium text-base-content">
                            {user.firstName} {user.lastName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end space-x-1 group">
                        <div className="transform transition-all duration-200 group-hover:scale-110 group-hover:rotate-12">
                          <Star3D />
                        </div>
                        <span className="font-semibold transition-all duration-200 group-hover:text-yellow-600">
                          {user.points}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className="font-semibold">{user.solvedCount}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-base-300">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="btn btn-outline btn-sm"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-base-content/70">
                  Page {currentPage} of {totalPages}
                </span>
              </div>

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="btn btn-outline btn-sm"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
