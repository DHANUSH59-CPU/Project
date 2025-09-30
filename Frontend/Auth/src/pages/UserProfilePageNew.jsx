import { useState, useEffect } from "react";
import { Edit } from "lucide-react";
import axiosClient from "../utils/axios";
import Loading from "../components/Loading";
import UserInfoCard from "../components/profile/UserInfoCard";
import DailySubmissionsChart from "../components/profile/DailySubmissionsChart";
import MonthlySubmissionsLineChart from "../components/profile/MonthlySubmissionsLineChart";
import YearlyActivityHeatMap from "../components/profile/YearlyActivityHeatMap";

const UserProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
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
                  <h3 className="text-lg font-semibold text-base-content">
                    Recent Activity
                  </h3>
                  <p className="text-sm text-primary font-semibold">
                    Total for period:{" "}
                    {profile.statistics?.totalProblemsSolved || 0}
                  </p>
                </div>
                <button
                  onClick={() => setShowEditModal(true)}
                  className="btn btn-outline btn-sm"
                >
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </button>
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
                    Total for period:{" "}
                    {profile.statistics?.totalProblemsSolved || 0}
                  </p>
                </div>
              </div>
              <MonthlySubmissionsLineChart activity={[]} />
            </div>

            {/* Yearly Activity Heatmap */}
            <YearlyActivityHeatMap
              year={new Date().getFullYear()}
              activityData={[]}
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
      </div>
    </div>
  );
};

export default UserProfilePage;
