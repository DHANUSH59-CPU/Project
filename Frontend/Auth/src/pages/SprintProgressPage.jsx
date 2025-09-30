import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Clock,
  CheckCircle,
  Circle,
  Trophy,
  Target,
  Award,
  ChevronLeft,
  Play,
} from "lucide-react";
import axiosClient from "../utils/axios";
import Loading from "../components/Loading";

const SprintProgressPage = () => {
  const { sprintId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sprint, setSprint] = useState(null);

  useEffect(() => {
    fetchSprintDetails();
  }, [sprintId]);

  const fetchSprintDetails = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get(`/sprint/${sprintId}`);
      setSprint(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching sprint details:", error);
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "text-green-500 bg-green-100";
      case "Medium":
        return "text-yellow-500 bg-yellow-100";
      case "Hard":
        return "text-red-500 bg-red-100";
      default:
        return "text-gray-500 bg-gray-100";
    }
  };

  const handleProblemClick = (problemId) => {
    navigate(`/problems/${problemId}`);
  };

  if (loading) {
    return <Loading />;
  }

  if (!sprint) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-base-content mb-2">
            Sprint Not Found
          </h2>
          <p className="text-base-content/70">
            The sprint you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  if (!sprint.userProgress || sprint.userProgress.status === "not_started") {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-base-content mb-2">
            Sprint Not Started
          </h2>
          <p className="text-base-content/70 mb-4">
            You haven't started this sprint yet.
          </p>
          <button
            onClick={() => navigate(`/sprint/${sprintId}`)}
            className="btn btn-primary"
          >
            Go to Sprint Details
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate(`/sprint/${sprintId}`)}
          className="flex items-center space-x-2 text-base-content/70 hover:text-base-content mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Sprint Details</span>
        </button>

        {/* Sprint Progress Header */}
        <div className="bg-base-100 rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-base-content mb-2">
                {sprint.title}
              </h1>
              <p className="text-base-content/70">
                {sprint.category} • {sprint.difficulty}
              </p>
            </div>

            {sprint.userProgress.isCompleted && (
              <div className="text-center">
                <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
                <span className="text-lg font-semibold text-yellow-500">
                  Completed!
                </span>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-semibold text-base-content">
                Progress
              </span>
              <span className="text-lg font-semibold text-primary">
                {sprint.userProgress.progressPercentage}%
              </span>
            </div>
            <div className="w-full bg-base-300 rounded-full h-4">
              <div
                className="bg-primary h-4 rounded-full transition-all duration-300"
                style={{ width: `${sprint.userProgress.progressPercentage}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between mt-2 text-sm text-base-content/70">
              <span>
                {sprint.userProgress.problemsSolvedCount} of{" "}
                {sprint.problemCount} problems solved
              </span>
              <span>{sprint.userProgress.totalTimeSpent} minutes spent</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-base-200 rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {sprint.userProgress.problemsSolvedCount}
              </div>
              <div className="text-sm text-base-content/70">
                Problems Solved
              </div>
            </div>
            <div className="text-center p-4 bg-base-200 rounded-lg">
              <div className="text-2xl font-bold text-secondary">
                {sprint.userProgress.currentStreak}
              </div>
              <div className="text-sm text-base-content/70">Current Streak</div>
            </div>
            <div className="text-center p-4 bg-base-200 rounded-lg">
              <div className="text-2xl font-bold text-accent">
                {sprint.userProgress.longestStreak}
              </div>
              <div className="text-sm text-base-content/70">Longest Streak</div>
            </div>
            <div className="text-center p-4 bg-base-200 rounded-lg">
              <div className="text-2xl font-bold text-info">
                {sprint.userProgress.totalTimeSpent}m
              </div>
              <div className="text-sm text-base-content/70">Time Spent</div>
            </div>
          </div>
        </div>

        {/* Problems List */}
        <div className="bg-base-100 rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-base-content mb-6">
            Problems
          </h3>
          <div className="space-y-4">
            {sprint.problems?.map((problem, index) => {
              const isSolved = sprint.userProgress.problemsSolved?.find(
                (p) => p.problemId.toString() === problem._id.toString()
              );

              return (
                <div
                  key={problem._id}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    isSolved
                      ? "bg-green-50 border-green-200"
                      : "bg-base-200 border-base-300 hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                          isSolved
                            ? "bg-green-500 text-white"
                            : "bg-primary text-primary-content"
                        }`}
                      >
                        {isSolved ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          index + 1
                        )}
                      </div>

                      <div>
                        <h4 className="font-medium text-base-content">
                          {problem.title}
                        </h4>
                        <div className="flex items-center space-x-2 text-sm text-base-content/70">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              problem.difficulty === "Easy"
                                ? "bg-green-100 text-green-600"
                                : problem.difficulty === "Medium"
                                ? "bg-yellow-100 text-yellow-600"
                                : "bg-red-100 text-red-600"
                            }`}
                          >
                            {problem.difficulty}
                          </span>
                          {problem.tags?.slice(0, 2).map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="px-2 py-1 bg-base-300 text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      {isSolved && (
                        <div className="text-sm text-green-600">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{isSolved.timeSpent}m</span>
                          </div>
                          <div className="text-xs text-base-content/70">
                            {new Date(isSolved.solvedAt).toLocaleDateString()}
                          </div>
                        </div>
                      )}

                      <button
                        onClick={() => handleProblemClick(problem._id)}
                        className={`btn btn-sm ${
                          isSolved ? "btn-success" : "btn-primary"
                        }`}
                      >
                        {isSolved ? "Review" : "Solve"}
                        <Play className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Completion Rewards */}
        {sprint.userProgress.isCompleted &&
          sprint.userProgress.rewardsEarned?.length > 0 && (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-6 mt-8">
              <div className="flex items-center space-x-2 mb-4">
                <Award className="w-6 h-6 text-yellow-500" />
                <h3 className="text-lg font-semibold text-base-content">
                  Rewards Earned
                </h3>
              </div>
              <div className="space-y-2">
                {sprint.userProgress.rewardsEarned.map((reward, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 text-sm"
                  >
                    <span className="text-yellow-500">🏆</span>
                    <span>
                      {reward.type === "points" && `+${reward.value} points`}
                      {reward.type === "badge" && `Badge: ${reward.badgeName}`}
                      {reward.type === "certificate" &&
                        "Completion Certificate"}
                    </span>
                    <span className="text-base-content/50">
                      ({new Date(reward.earnedAt).toLocaleDateString()})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default SprintProgressPage;
