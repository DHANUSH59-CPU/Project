import { useState, useEffect } from "react";
import { Crown, Trophy, Star, ChevronLeft, ChevronRight } from "lucide-react";
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

  const getPodiumIcon = (rank) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Trophy className="w-4 h-4 text-gray-400" />;
    if (rank === 3) return <Trophy className="w-4 h-4 text-orange-500" />;
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
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  #{userStats.rank}
                </div>
                <div className="text-sm text-base-content/70">Rank</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary">
                  {userStats.points}
                </div>
                <div className="text-sm text-base-content/70">Points</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">
                  {userStats.solvedCount}
                </div>
                <div className="text-sm text-base-content/70">
                  Problems Solved
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-info">
                  {userStats.streaks?.current || 0}
                </div>
                <div className="text-sm text-base-content/70">
                  Current Streak
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
                    className="border-b border-base-300 hover:bg-base-200"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        {getPodiumIcon(user.rank)}
                        <span
                          className={`font-semibold ${getRankColor(user.rank)}`}
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
                      <div className="flex items-center justify-end space-x-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="font-semibold">{user.points}</span>
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
