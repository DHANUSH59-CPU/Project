import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  FiPlay,
  FiPause,
  FiVolume2,
  FiVolumeX,
  FiMaximize,
  FiClock,
  FiUser,
  FiTrash2,
  FiMoreVertical,
} from "react-icons/fi";
import axiosClient from "../utils/axios";

const VideoPlayer = ({ problemId }) => {
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Get current user from Redux store
  const { user } = useSelector((state) => state.authSlice || {});

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest(".dropdown-container")) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

  useEffect(() => {
    const fetchVideoSolution = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get(`/video/${problemId}`);
        setVideoData(response.data.videoSolution);
        setError(null);
      } catch (err) {
        if (err.response?.status === 404) {
          setError("No video solution available for this problem");
        } else {
          setError("Failed to load video solution");
        }
        setVideoData(null);
      } finally {
        setLoading(false);
      }
    };

    if (problemId) {
      fetchVideoSolution();
    }
  }, [problemId]);

  const togglePlayPause = () => {
    const video = document.getElementById(`video-${problemId}`);
    if (video) {
      if (video.paused) {
        video.play();
        setIsPlaying(true);
      } else {
        video.pause();
        setIsPlaying(false);
      }
    }
  };

  const toggleMute = () => {
    const video = document.getElementById(`video-${problemId}`);
    if (video) {
      video.muted = !video.muted;
      setIsMuted(video.muted);
    }
  };

  const toggleFullscreen = () => {
    const video = document.getElementById(`video-${problemId}`);
    if (video) {
      if (!document.fullscreenElement) {
        video.requestFullscreen();
        setIsFullscreen(true);
      } else {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Check if current user can delete the video
  const canDeleteVideo = () => {
    if (!user || !videoData) return false;

    // Admin can delete any video
    if (user.role === "admin") return true;

    // Video uploader can delete their own video
    if (videoData.uploadedBy && user._id === videoData.uploadedBy._id)
      return true;

    return false;
  };

  // Handle video deletion
  const handleDeleteVideo = async () => {
    if (!canDeleteVideo()) return;

    setDeleting(true);
    try {
      await axiosClient.delete(`/video/delete/${problemId}`);

      // Clear video data and show success message
      setVideoData(null);
      setError("Video deleted successfully");
      setShowDeleteConfirm(false);
      setShowDropdown(false);
    } catch (err) {
      console.error("Delete error:", err);
      alert(err.response?.data?.error || "Failed to delete video");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="loading loading-spinner loading-lg text-primary"></div>
        <span className="ml-4 text-base-content/70">
          Loading video solution...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-base-200 rounded-lg">
        <div className="text-base-content/50 mb-2">
          <svg
            className="w-16 h-16 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        </div>
        <p className="text-base-content/70">{error}</p>
      </div>
    );
  }

  if (!videoData) {
    return null;
  }

  return (
    <div className="bg-base-100 rounded-lg shadow-lg overflow-hidden">
      {/* Video Header */}
      <div className="p-4 border-b border-base-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-full">
              <svg
                className="w-5 h-5 text-primary"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-base-content">
                Video Solution
              </h3>
              <p className="text-sm text-base-content/70">
                Step-by-step explanation
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4 text-sm text-base-content/70">
              <div className="flex items-center gap-1">
                <FiClock className="w-4 h-4" />
                <span>{formatDuration(videoData.duration)}</span>
              </div>
              <div className="flex items-center gap-1">
                <FiUser className="w-4 h-4" />
                <span>{videoData.uploadedBy?.username || "Admin"}</span>
              </div>
            </div>

            {/* Delete Button - Only show if user can delete */}
            {canDeleteVideo() && (
              <div className="relative dropdown-container">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="btn btn-ghost btn-sm"
                  title="Video Options"
                >
                  <FiMoreVertical className="w-4 h-4" />
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute right-0 top-full mt-1 bg-base-100 border border-base-300 rounded-lg shadow-lg z-10 min-w-[120px]">
                    <button
                      onClick={() => {
                        setShowDeleteConfirm(true);
                        setShowDropdown(false);
                      }}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-error hover:bg-error/10 rounded-lg transition-colors"
                      disabled={deleting}
                    >
                      <FiTrash2 className="w-4 h-4" />
                      Delete Video
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Video Player */}
      <div className="relative bg-black">
        <video
          id={`video-${problemId}`}
          src={videoData.secureUrl}
          poster={videoData.thumbnailUrl}
          className="w-full h-auto max-h-96"
          controls
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onVolumeChange={(e) => setIsMuted(e.target.muted)}
        />

        {/* Custom Controls Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={togglePlayPause}
                className="btn btn-sm btn-ghost text-white hover:bg-white/20"
              >
                {isPlaying ? (
                  <FiPause className="w-4 h-4" />
                ) : (
                  <FiPlay className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={toggleMute}
                className="btn btn-sm btn-ghost text-white hover:bg-white/20"
              >
                {isMuted ? (
                  <FiVolumeX className="w-4 h-4" />
                ) : (
                  <FiVolume2 className="w-4 h-4" />
                )}
              </button>
            </div>
            <button
              onClick={toggleFullscreen}
              className="btn btn-sm btn-ghost text-white hover:bg-white/20"
            >
              <FiMaximize className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Video Info */}
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-base-content/70">Problem:</span>
            <p className="text-base-content">{videoData.problem?.title}</p>
          </div>
          <div>
            <span className="font-medium text-base-content/70">Uploaded:</span>
            <p className="text-base-content">
              {formatDate(videoData.uploadedAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-base-100 rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-base-content mb-4">
              Delete Video Solution
            </h3>
            <p className="text-base-content/70 mb-6">
              Are you sure you want to delete this video solution? This action
              cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="btn btn-ghost"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteVideo}
                className="btn btn-error"
                disabled={deleting}
              >
                {deleting ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Deleting...
                  </>
                ) : (
                  <>
                    <FiTrash2 className="w-4 h-4" />
                    Delete Video
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
