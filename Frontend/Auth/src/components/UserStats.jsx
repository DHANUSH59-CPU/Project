import { useState, useEffect } from "react";
import { Star, Trophy, Target } from "lucide-react";
import axiosClient from "../utils/axios";

const UserStats = () => {
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      const response = await axiosClient.get("/leaderboard/stats");
      setUserStats(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user stats:", error);
      console.error("Error response:", error.response?.data);
      setLoading(false);
    }
  };

  if (loading || !userStats) {
    return null;
  }

  return (
    <div className="flex items-center space-x-4 text-sm">
      <div className="flex items-center space-x-1">
        <Star className="w-4 h-4 text-yellow-500" />
        <span className="font-semibold">{userStats.points}</span>
        <span className="text-base-content/70">pts</span>
      </div>

      <div className="flex items-center space-x-1">
        <Target className="w-4 h-4 text-green-500" />
        <span className="font-semibold">{userStats.solvedCount}</span>
        <span className="text-base-content/70">solved</span>
      </div>

      <div className="flex items-center space-x-1">
        <Trophy className="w-4 h-4 text-orange-500" />
        <span className="font-semibold">{userStats.currentStreak}</span>
        <span className="text-base-content/70">streak</span>
      </div>
    </div>
  );
};

export default UserStats;
