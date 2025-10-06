import { useState, useEffect } from "react";
import {
  Edit,
  Trash2,
  AlertTriangle,
  Upload,
  X,
  Image as ImageIcon,
} from "lucide-react";
import axiosClient from "../utils/axios";
import axios from "axios";
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
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
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

  const handleImageUpload = async (file) => {
    setUploadingImage(true);
    setUploadProgress(0);

    try {
      // Get upload signature from backend
      const signatureResponse = await axiosClient.get("/profile/image/upload");

      const { signature, timestamp, public_id, api_key, upload_url } =
        signatureResponse.data;

      // Prepare form data for Cloudinary upload
      const fd = new FormData();
      fd.append("file", file);
      fd.append("signature", signature);
      fd.append("timestamp", timestamp);
      fd.append("public_id", public_id);
      fd.append("api_key", api_key);

      // Upload to Cloudinary
      const uploadResponse = await axios.post(upload_url, fd, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          const progress = Math.round((e.loaded * 100) / e.total);
          setUploadProgress(progress);
        },
      });

      const cloudinaryResult = uploadResponse.data;

      // Save metadata to database
      const metadataResponse = await axiosClient.post("/profile/image/save", {
        cloudinaryPublicId: cloudinaryResult.public_id,
        secureUrl: cloudinaryResult.secure_url,
      });

      // Update local state
      setEditForm({
        ...editForm,
        profileImageUrl: cloudinaryResult.secure_url,
      });

      // Update profile state
      setProfile({
        ...profile,
        profileImageUrl: cloudinaryResult.secure_url,
        profile_img: cloudinaryResult.secure_url,
      });

      setSelectedImage(null);
      setUploadProgress(0);
    } catch (error) {
      console.error("Image upload error:", error);
      alert("Image upload failed. Please try again.");
    } finally {
      setUploadingImage(false);
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
                {/* Profile Image Section */}
                <div>
                  <label className="label">
                    <span className="label-text">Profile Image</span>
                  </label>

                  {/* Current Image Display */}
                  {editForm.profileImageUrl && (
                    <div className="mb-4">
                      <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                        <img
                          src={editForm.profileImageUrl}
                          alt="Current profile"
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <p className="text-sm text-base-content/70">
                            Current image
                          </p>
                          <button
                            type="button"
                            onClick={() =>
                              setEditForm({ ...editForm, profileImageUrl: "" })
                            }
                            className="btn btn-sm btn-ghost text-error"
                          >
                            <X className="w-4 h-4" />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Image Upload Area */}
                  <div
                    onDragEnter={(e) => {
                      e.preventDefault();
                      setDragOver(true);
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      setDragOver(false);
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragOver(false);
                      const files = e.dataTransfer.files;
                      if (files.length > 0) {
                        const file = files[0];
                        if (
                          file.type.startsWith("image/") &&
                          file.size <= 10 * 1024 * 1024
                        ) {
                          setSelectedImage(file);
                        } else {
                          alert("Please select a valid image file under 10MB");
                        }
                      }
                    }}
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                      dragOver
                        ? "border-primary bg-primary/10"
                        : "border-base-300 hover:border-primary"
                    }`}
                  >
                    {selectedImage ? (
                      <div className="space-y-3">
                        <img
                          src={URL.createObjectURL(selectedImage)}
                          alt="Selected"
                          className="w-20 h-20 rounded-full object-cover mx-auto"
                        />
                        <p className="text-sm text-base-content/70">
                          {selectedImage.name}
                        </p>
                        <div className="flex gap-2 justify-center">
                          <button
                            type="button"
                            onClick={() => handleImageUpload(selectedImage)}
                            disabled={uploadingImage}
                            className="btn btn-primary btn-sm"
                          >
                            {uploadingImage ? (
                              <>
                                <span className="loading loading-spinner loading-xs"></span>
                                Uploading... {uploadProgress}%
                              </>
                            ) : (
                              <>
                                <Upload className="w-4 h-4" />
                                Upload Image
                              </>
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedImage(null)}
                            className="btn btn-ghost btn-sm"
                          >
                            <X className="w-4 h-4" />
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <ImageIcon className="w-12 h-12 mx-auto text-base-content/50" />
                        <div>
                          <p className="text-base-content/70">
                            Drag & drop an image here, or{" "}
                            <label className="link link-primary cursor-pointer">
                              browse files
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files[0];
                                  if (file && file.size <= 10 * 1024 * 1024) {
                                    setSelectedImage(file);
                                  } else {
                                    alert(
                                      "Please select a valid image file under 10MB"
                                    );
                                  }
                                }}
                              />
                            </label>
                          </p>
                          <p className="text-xs text-base-content/50">
                            Max 10MB, JPG/PNG/GIF/WebP
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Manual URL Input (Alternative) */}
                  <div className="mt-4">
                    <label className="label">
                      <span className="label-text">
                        Or enter image URL manually
                      </span>
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
