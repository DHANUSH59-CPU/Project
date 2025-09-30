import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Clock,
  Users,
  Star,
  Trophy,
  CheckCircle,
  Circle,
  Play,
  Target,
  Award,
  ChevronLeft,
} from "lucide-react";
import axiosClient from "../utils/axios";
import Loading from "../components/Loading";

const SprintDetailPage = () => {
  const { sprintId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sprint, setSprint] = useState(null);
  const [starting, setStarting] = useState(false);

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

  const handleStartSprint = async () => {
    try {
      setStarting(true);
      await axiosClient.post(`/sprint/${sprintId}/start`);
      // Navigate to first problem or sprint progress page
      navigate(`/sprint/${sprintId}/progress`);
    } catch (error) {
      console.error("Error starting sprint:", error);
      alert("Failed to start sprint. Please try again.");
    } finally {
      setStarting(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner":
        return "text-green-500 bg-green-100";
      case "Intermediate":
        return "text-yellow-500 bg-yellow-100";
      case "Advanced":
        return "text-red-500 bg-red-100";
      default:
        return "text-gray-500 bg-gray-100";
    }
  };

  const getCategoryIcon = (category) => {
    const iconMap = {
      Arrays: "📊",
      Strings: "📝",
      "Dynamic Programming": "🧠",
      Graphs: "🕸️",
      Trees: "🌳",
      Sorting: "🔄",
      Searching: "🔍",
      Greedy: "💰",
      Backtracking: "🔙",
      Math: "🔢",
      "Bit Manipulation": "⚡",
      "Two Pointers": "👆",
      "Sliding Window": "🪟",
      Stack: "📚",
      Queue: "🚶",
      "Hash Table": "🗂️",
      "Linked List": "🔗",
      "Binary Search": "🔍",
      Recursion: "🔄",
    };
    return iconMap[category] || "📋";
  };

  const formatTime = (minutes) => {
    if (minutes < 60) return `${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours} hours ${mins} minutes` : `${hours} hours`;
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

  return (
    <div className="min-h-screen bg-base-200 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate("/sprints")}
          className="flex items-center space-x-2 text-base-content/70 hover:text-base-content mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Sprints</span>
        </button>

        {/* Sprint Header */}
        <div className="bg-base-100 rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              <span className="text-4xl">
                {getCategoryIcon(sprint.category)}
              </span>
              <div>
                <h1 className="text-3xl font-bold text-base-content mb-2">
                  {sprint.title}
                </h1>
                <div className="flex items-center space-x-4">
                  <span className="text-base-content/70">
                    {sprint.category}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(
                      sprint.difficulty
                    )}`}
                  >
                    {sprint.difficulty}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="flex items-center space-x-4 text-sm text-base-content/70 mb-2">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{formatTime(sprint.estimatedTime)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{sprint.problemCount} problems</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4" />
                  <span>{sprint.points} points</span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-lg text-base-content/80 mb-6">
            {sprint.description}
          </p>

          {/* User Progress */}
          {sprint.userProgress && (
            <div className="bg-base-200 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-base-content">
                  Your Progress
                </h3>
                <span className="text-sm text-base-content/70">
                  {sprint.userProgress.progressPercentage}% Complete
                </span>
              </div>

              <div className="w-full bg-base-300 rounded-full h-3 mb-4">
                <div
                  className="bg-primary h-3 rounded-full transition-all duration-300"
                  style={{
                    width: `${sprint.userProgress.progressPercentage}%`,
                  }}
                ></div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {sprint.userProgress.problemsSolvedCount}
                  </div>
                  <div className="text-base-content/70">Problems Solved</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary">
                    {sprint.userProgress.currentStreak}
                  </div>
                  <div className="text-base-content/70">Current Streak</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">
                    {sprint.userProgress.longestStreak}
                  </div>
                  <div className="text-base-content/70">Longest Streak</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-info">
                    {sprint.userProgress.totalTimeSpent}m
                  </div>
                  <div className="text-base-content/70">Time Spent</div>
                </div>
              </div>
            </div>
          )}

          {/* Learning Objectives */}
          {sprint.learningObjectives &&
            sprint.learningObjectives.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-base-content mb-3">
                  Learning Objectives
                </h3>
                <ul className="space-y-2">
                  {sprint.learningObjectives.map((objective, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <Target className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-base-content/80">{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          {/* Prerequisites */}
          {sprint.prerequisites && sprint.prerequisites.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-base-content mb-3">
                Prerequisites
              </h3>
              <ul className="space-y-1">
                {sprint.prerequisites.map((prereq, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <Circle className="w-4 h-4 text-base-content/50 mt-0.5 flex-shrink-0" />
                    <span className="text-base-content/70">{prereq}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Completion Reward */}
          {sprint.completionReward && (
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <Award className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-base-content">
                  Completion Reward
                </h3>
              </div>
              <p className="text-base-content/80">
                {sprint.completionReward.type === "points" &&
                  `Earn ${sprint.completionReward.value} bonus points upon completion!`}
                {sprint.completionReward.type === "badge" &&
                  `Unlock the "${sprint.completionReward.badgeName}" badge!`}
                {sprint.completionReward.type === "certificate" &&
                  `Receive a completion certificate!`}
              </p>
            </div>
          )}

          {/* Action Button */}
          <div className="flex justify-center">
            {sprint.userProgress?.isCompleted ? (
              <button className="btn btn-success btn-lg">
                <Trophy className="w-5 h-5" />
                Sprint Completed!
              </button>
            ) : sprint.userProgress?.status === "in_progress" ? (
              <button
                onClick={() => navigate(`/sprint/${sprintId}/progress`)}
                className="btn btn-primary btn-lg"
              >
                <Play className="w-5 h-5" />
                Continue Sprint
              </button>
            ) : (
              <button
                onClick={handleStartSprint}
                disabled={starting}
                className="btn btn-primary btn-lg"
              >
                {starting ? (
                  <>
                    <div className="loading loading-spinner loading-sm"></div>
                    Starting...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Start Sprint
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Problems List */}
        <div className="bg-base-100 rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-base-content mb-4">
            Problems in this Sprint
          </h3>
          <div className="space-y-3">
            {sprint.problems?.map((problem, index) => (
              <div
                key={problem._id}
                className="flex items-center justify-between p-4 bg-base-200 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary text-primary-content rounded-full flex items-center justify-center text-sm font-semibold">
                    {index + 1}
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

                <div className="flex items-center space-x-2">
                  {sprint.userProgress?.problemsSolved?.find(
                    (p) => p.problemId.toString() === problem._id.toString()
                  ) ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <Circle className="w-5 h-5 text-base-content/30" />
                  )}
                  <button
                    onClick={() => navigate(`/problems/${problem._id}`)}
                    className="btn btn-sm btn-outline"
                  >
                    Solve
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SprintDetailPage;
