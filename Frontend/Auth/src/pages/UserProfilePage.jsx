import { useState, useEffect } from "react";
import { Edit, Trash2, AlertTriangle } from "lucide-react";
import axiosClient from "../utils/axios";
import Loading from "../components/Loading";
import UserInfoCard from "../components/profile/UserInfoCard";
import DailySubmissionsChart from "../components/profile/DailySubmissionsChart";
import MonthlySubmissionsLineChart from "../components/profile/MonthlySubmissionsLineChart";
import YearlyActivityHeatMap from "../components/profile/YearlyActivityHeatMap";
import { useNavigate } from "react-router";

const UserProfilePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    age: "",
    profileImageUrl: "",
  });
  const [dailyActivity, setDailyActivity] = useState([]);
  const [monthlyTrends, setMonthlyTrends] = useState([]);
  const [yearlyActivity, setYearlyActivity] = useState([]);
  const [chartStats, setChartStats] = useState(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);

      // Fetch all data in parallel
      const [
        profileResponse,
        dailyResponse,
        monthlyResponse,
        yearlyResponse,
        statsResponse,
      ] = await Promise.all([
        axiosClient.get("/profile"),
        axiosClient.get("/activity/daily?days=14"),
        axiosClient.get("/activity/monthly?days=30"),
        axiosClient.get("/activity/yearly"),
        axiosClient.get("/activity/stats"),
      ]);

      setProfile(profileResponse.data);
      setDailyActivity(dailyResponse.data.activity || []);
      setMonthlyTrends(monthlyResponse.data.trends || []);
      setYearlyActivity(yearlyResponse.data.activity || []);
      setChartStats(statsResponse.data);

      setEditForm({
        firstName: profileResponse.data.firstName || "",
        lastName: profileResponse.data.lastName || "",
        age: profileResponse.data.age || "",
        profileImageUrl: profileResponse.data.profileImageUrl || "",
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

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") {
      alert("Please type 'DELETE' to confirm account deletion.");
      return;
    }

    setIsDeleting(true);
    try {
      await axiosClient.delete("/user/profile");
      alert(
        "Account deleted successfully. You will be redirected to the login page."
      );
      // Clear any stored tokens
      localStorage.removeItem("token");
      sessionStorage.clear();
      // Redirect to login page
      navigate("/login");
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Failed to delete account. Please try again.");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setDeleteConfirmText("");
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
            <UserInfoCard
              user={{ ...profile, statistics: chartStats?.solvedStats }}
            />
          </div>

          <div className="lg:col-span-2 space-y-6">
            {/* Recent Activity Chart */}
            <div className="bg-base-100 shadow-lg rounded-lg p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-2 sm:space-y-0">
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold text-base-content">
                    Recent Activity
                  </h3>
                  <p className="text-sm text-primary font-semibold">
                    Total for period:{" "}
                    {profile.statistics?.totalProblemsSolved || 0}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="btn btn-outline btn-sm"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Profile
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="btn btn-error btn-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Account
                  </button>
                </div>
              </div>
              <DailySubmissionsChart activity={dailyActivity} />
            </div>

            {/* Submissions Trend Chart */}
            <div className="bg-base-100 shadow-lg rounded-lg p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-2 sm:space-y-0">
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold text-base-content">
                    Recent Accepted Submissions Trend
                  </h3>
                  <p className="text-sm text-primary font-semibold">
                    Total for period:{" "}
                    {profile.statistics?.totalProblemsSolved || 0}
                  </p>
                </div>
              </div>
              <MonthlySubmissionsLineChart activity={monthlyTrends} />
            </div>

            {/* Yearly Activity Heatmap */}
            <YearlyActivityHeatMap
              year={new Date().getFullYear()}
              activityData={yearlyActivity}
              onYearChange={(year) => console.log("Year changed:", year)}
              availableYears={[
                new Date().getFullYear(),
                new Date().getFullYear() - 1,
              ]}
            />
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

        {/* Delete Account Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-base-100 p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-error/20 rounded-full">
                  <AlertTriangle className="w-6 h-6 text-error" />
                </div>
                <h3 className="text-xl font-bold text-error">Delete Account</h3>
              </div>

              <div className="mb-6">
                <p className="text-base-content/80 mb-4">
                  <strong>Warning:</strong> This action cannot be undone. This
                  will permanently delete your account and all associated data
                  including:
                </p>
                <ul className="list-disc list-inside text-sm text-base-content/70 mb-4 space-y-1">
                  <li>Your profile information</li>
                  <li>All your submissions</li>
                  <li>Your likes, favorites, and comments</li>
                  <li>All your activity history</li>
                </ul>
                <p className="text-sm text-base-content/80">
                  Type <strong className="text-error">DELETE</strong> to
                  confirm:
                </p>
              </div>

              <div className="mb-6">
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="Type DELETE to confirm"
                  className="input input-bordered w-full"
                  disabled={isDeleting}
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteConfirmText("");
                  }}
                  className="btn btn-ghost"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="btn btn-error"
                  disabled={isDeleting || deleteConfirmText !== "DELETE"}
                >
                  {isDeleting ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Delete Account
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;
