import { useState, useEffect } from "react";
import {
  User,
  Edit,
  Trophy,
  Target,
  Clock,
  Star,
  Award,
  TrendingUp,
  Calendar,
  Settings,
  Activity,
  BarChart3,
} from "lucide-react";
import axiosClient from "../utils/axios";
import Loading from "../components/Loading";
import UserInfoCard from "../components/profile/UserInfoCard";
import DailySubmissionsChart from "../components/profile/DailySubmissionsChart";
import MonthlySubmissionsLineChart from "../components/profile/MonthlySubmissionsLineChart";
import YearlyActivityHeatMap from "../components/profile/YearlyActivityHeatMap";

const UserProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    age: "",
    profileImageUrl: "",
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get("/profile");
      setProfile(response.data);
      setEditForm({
        firstName: response.data.firstName || "",
        lastName: response.data.lastName || "",
        age: response.data.age || "",
        profileImageUrl: response.data.profileImageUrl || "",
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setLoading(false);
    }
  };

  const handleEditProfile = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.put("/profile", editForm);
      setShowEditModal(false);
      fetchUserProfile();
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
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

  if (loading) {
    return <Loading />;
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-base-content mb-2">
            Profile Not Found
          </h2>
          <p className="text-base-content/70">
            Unable to load your profile information.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <UserInfoCard user={profile} />
          </div>

          <div className="lg:col-span-2 space-y-6">
            {/* Recent Activity Chart */}
            <div className="bg-base-100 shadow-lg rounded-lg p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-2 sm:space-y-0">
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold text-base-content">Recent Activity</h3>
                  <p className="text-sm text-primary font-semibold">
                    Total for period: {profile.statistics?.totalProblemsSolved || 0}
                  </p>
                </div>
              </div>
              <DailySubmissionsChart activity={[]} />
            </div>

            {/* Submissions Trend Chart */}
            <div className="bg-base-100 shadow-lg rounded-lg p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-2 sm:space-y-0">
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold text-base-content">
                    Recent Accepted Submissions Trend
                  </h3>
                  <p className="text-sm text-primary font-semibold">
                    Total for period: {profile.statistics?.totalProblemsSolved || 0}
                  </p>
                </div>
              </div>
              <MonthlySubmissionsLineChart activity={[]} />
            </div>

            {/* Yearly Activity Heatmap */}
            <YearlyActivityHeatMap
              year={new Date().getFullYear()}
              activityData={[]}
              onYearChange={(year) => console.log('Year changed:', year)}
              availableYears={[new Date().getFullYear(), new Date().getFullYear() - 1]}
            />

        {/* Tabs */}
        <div className="bg-base-100 rounded-lg shadow-lg mb-8">
          <div className="border-b border-base-300">
            <nav className="flex space-x-8 px-6">
              {[
                { id: "overview", label: "Overview", icon: BarChart3 },
                { id: "activity", label: "Activity", icon: Activity },
                { id: "achievements", label: "Achievements", icon: Award },
                { id: "settings", label: "Settings", icon: Settings },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors ${
                    activeTab === id
                      ? "border-primary text-primary"
                      : "border-transparent text-base-content/70 hover:text-base-content"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Problem Statistics */}
                  <div className="bg-base-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-base-content mb-4">
                      Problem Statistics
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-base-content/70">
                          Total Solved
                        </span>
                        <span className="font-semibold">
                          {profile.statistics?.totalProblemsSolved || 0}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-base-content/70">
                          Total Attempted
                        </span>
                        <span className="font-semibold">
                          {profile.statistics?.totalProblemsAttempted || 0}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-base-content/70">
                          Success Rate
                        </span>
                        <span className="font-semibold">
                          {profile.statistics?.successRate || 0}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Difficulty Breakdown */}
                  <div className="bg-base-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-base-content mb-4">
                      Difficulty Breakdown
                    </h3>
                    <div className="space-y-3">
                      {profile.statistics.statsByDifficulty &&
                        Object.entries(
                          profile.statistics.statsByDifficulty
                        ).map(([difficulty, count]) => (
                          <div
                            key={difficulty}
                            className="flex justify-between items-center"
                          >
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                                difficulty
                              )}`}
                            >
                              {difficulty}
                            </span>
                            <span className="font-semibold">{count}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                {/* Recent Problems */}
                <div className="bg-base-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-base-content mb-4">
                    Recent Problems Solved
                  </h3>
                  <div className="space-y-3">
                    {Array.isArray(profile.recentActivity) &&
                      profile.recentActivity.slice(0, 5).map((problem) => (
                        <div
                          key={problem._id}
                          className="flex items-center justify-between p-3 bg-base-100 rounded-lg"
                        >
                          <div>
                            <h4 className="font-medium text-base-content">
                              {problem.title}
                            </h4>
                            <div className="flex items-center space-x-2 text-sm text-base-content/70">
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(
                                  problem.difficulty
                                )}`}
                              >
                                {problem.difficulty}
                              </span>
                              {Array.isArray(problem.tags) &&
                                problem.tags.slice(0, 2).map((tag, index) => (
                                  <span
                                    key={index}
                                    className="px-2 py-1 bg-base-300 text-xs rounded-full"
                                  >
                                    {tag}
                                  </span>
                                ))}
                            </div>
                          </div>
                          <div className="text-sm text-base-content/70">
                            {new Date(problem.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* Activity Tab */}
            {activeTab === "activity" && (
              <div className="text-center py-12">
                <Activity className="w-16 h-16 text-base-content/30 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-base-content mb-2">
                  Activity Feed
                </h3>
                <p className="text-base-content/70">
                  Your recent activity will appear here.
                </p>
              </div>
            )}

            {/* Achievements Tab */}
            {activeTab === "achievements" && (
              <div className="text-center py-12">
                <Award className="w-16 h-16 text-base-content/30 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-base-content mb-2">
                  Achievements
                </h3>
                <p className="text-base-content/70">
                  Your achievements will appear here.
                </p>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="space-y-6">
                <div className="bg-base-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-base-content mb-4">
                    Account Settings
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="label">
                        <span className="label-text">Email</span>
                      </label>
                      <input
                        type="email"
                        value={profile.emailId}
                        disabled
                        className="input input-bordered w-full"
                      />
                      <p className="text-xs text-base-content/50 mt-1">
                        Email cannot be changed
                      </p>
                    </div>
                    <div>
                      <label className="label">
                        <span className="label-text">Role</span>
                      </label>
                      <input
                        type="text"
                        value={profile.role}
                        disabled
                        className="input input-bordered w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Edit Profile Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-base-100 rounded-lg shadow-xl p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-base-content mb-4">
                Edit Profile
              </h3>
              <form onSubmit={handleEditProfile} className="space-y-4">
                <div>
                  <label className="label">
                    <span className="label-text">First Name</span>
                  </label>
                  <input
                    type="text"
                    value={editForm.firstName}
                    onChange={(e) =>
                      setEditForm({ ...editForm, firstName: e.target.value })
                    }
                    className="input input-bordered w-full"
                    required
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text">Last Name</span>
                  </label>
                  <input
                    type="text"
                    value={editForm.lastName}
                    onChange={(e) =>
                      setEditForm({ ...editForm, lastName: e.target.value })
                    }
                    className="input input-bordered w-full"
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text">Age</span>
                  </label>
                  <input
                    type="number"
                    value={editForm.age}
                    onChange={(e) =>
                      setEditForm({ ...editForm, age: e.target.value })
                    }
                    className="input input-bordered w-full"
                    min="6"
                    max="80"
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text">Profile Image URL</span>
                  </label>
                  <input
                    type="url"
                    value={editForm.profileImageUrl}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        profileImageUrl: e.target.value,
                      })
                    }
                    className="input input-bordered w-full"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="btn btn-ghost"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;
