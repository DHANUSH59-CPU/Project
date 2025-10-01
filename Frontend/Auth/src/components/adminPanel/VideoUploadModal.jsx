import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  FiUpload,
  FiX,
  FiVideo,
  FiLoader,
  FiCheck,
  FiAlertCircle,
  FiFile,
  FiInfo,
} from "react-icons/fi";
import axiosClient from "../../utils/axios";
import axios from "axios";

const VideoUploadModal = ({ isOpen, onClose, problemId, problemTitle }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [uploadedVideo, setUploadedVideo] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
    clearErrors,
    setError,
  } = useForm({
    defaultValues: { videoFile: null },
  });

  const videoFile = watch("videoFile");

  const onSubmit = async (formData) => {
    const file = formData.videoFile[0];
    setUploading(true);
    setUploadProgress(0);
    clearErrors();
    setUploadedVideo(null);

    try {
      // Get upload signature from backend
      const signatureResponse = await axiosClient.get(
        `/video/upload/${problemId}`
      );
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
      const metadataResponse = await axiosClient.post(
        `/video/save/${problemId}`,
        {
          cloudinaryPublicId: cloudinaryResult.public_id,
          secureUrl: cloudinaryResult.secure_url,
          duration: cloudinaryResult.duration,
        }
      );

      setUploadedVideo(metadataResponse.data.videoSolution);
      reset();
      setUploadProgress(0);
      setShowPreview(false);
    } catch (err) {
      console.error("Upload error:", err);
      setError("root", {
        type: "manual",
        message: err.response?.data?.error || "Upload failed. Try again.",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    if (!uploading) {
      reset();
      setUploadedVideo(null);
      setShowPreview(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-base-100 p-6 rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-base-content flex items-center">
            <FiVideo className="mr-3 h-6 w-6 text-primary" />
            Upload Video Solution
          </h2>
          <button
            onClick={handleClose}
            disabled={uploading}
            className="btn btn-ghost btn-sm"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Problem Info */}
        <div className="mb-6 p-4 bg-base-200 rounded-lg">
          <h3 className="font-semibold text-base-content mb-2">Problem:</h3>
          <p className="text-base-content/80">{problemTitle}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <label className="block text-lg font-semibold text-base-content mb-4">
            Select Video File
          </label>

          <div
            onDragEnter={() => setDragOver(true)}
            onDragLeave={() => setDragOver(false)}
            onDrop={() => setDragOver(false)}
            className={`mt-1 flex justify-center px-6 py-8 border-2 rounded-lg border-dashed transition-colors ${
              dragOver
                ? "border-primary bg-primary/10"
                : "border-base-300 hover:border-primary"
            }`}
          >
            <div className="space-y-1 text-center">
              <FiUpload className="mx-auto h-12 w-12 text-base-content/50" />
              <div className="flex text-sm text-base-content/70">
                <label
                  htmlFor="videoFile"
                  className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary"
                >
                  <span>Choose a file</span>
                  <input
                    id="videoFile"
                    type="file"
                    className="sr-only"
                    accept="video/mp4,video/webm"
                    {...register("videoFile", {
                      required: "A video file is required.",
                      validate: {
                        acceptedFormats: (files) =>
                          ["video/mp4", "video/webm"].includes(
                            files[0]?.type
                          ) || "Only MP4 or WebM formats are accepted.",
                        maxSize: (files) =>
                          files[0]?.size < 100000000 ||
                          "File size must be less than 100MB.",
                      },
                    })}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-base-content/50">
                MP4, WebM up to 100MB
              </p>
            </div>
          </div>

          {videoFile?.[0] && (
            <div className="mt-4 flex items-center justify-between p-3 bg-base-200 rounded-lg relative">
              <div className="flex items-center">
                <FiFile className="mr-3 h-6 w-6 text-base-content/70" />
                <span className="font-medium text-sm text-base-content truncate max-w-[180px]">
                  {videoFile[0].name}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowPreview((prev) => !prev)}
                className="btn btn-primary btn-sm"
              >
                {showPreview ? "Hide Preview" : "Preview"}
              </button>

              {showPreview && videoFile?.[0] && (
                <div className="fixed top-4 right-4 z-50 bg-black/90 rounded-lg shadow-2xl p-3 w-80 max-h-[90vh] flex flex-col">
                  <button
                    onClick={() => setShowPreview(false)}
                    className="self-end mb-2 text-white hover:text-red-400 transition-colors"
                    title="Close Preview"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                  <video
                    src={URL.createObjectURL(videoFile[0])}
                    controls
                    className="w-full h-auto rounded-md"
                    style={{ maxHeight: "75vh" }}
                  />
                </div>
              )}
            </div>
          )}

          {errors.videoFile && (
            <p className="text-sm text-error mt-2">
              {errors.videoFile.message}
            </p>
          )}

          {/* Progress UI */}
          {uploading && (
            <div className="mt-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-base-content">
                  Uploading...
                </span>
                <span className="text-sm font-semibold text-primary">
                  {uploadProgress}%
                </span>
              </div>
              <div className="w-full bg-base-300 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          <div className="pt-6 space-y-4">
            <button
              type="submit"
              disabled={isSubmitting || uploading}
              className="btn btn-primary btn-lg w-full"
            >
              {isSubmitting || uploading ? (
                <>
                  <FiLoader className="animate-spin -ml-1 mr-3 h-5 w-5" />
                  Uploading...
                </>
              ) : (
                <>
                  <FiVideo className="mr-2 h-5 w-5" />
                  Upload Video Solution
                </>
              )}
            </button>

            {errors.root && (
              <div className="flex items-start p-4 bg-error/10 border border-error/20 rounded-lg">
                <FiAlertCircle className="h-5 w-5 text-error mt-0.5 mr-2" />
                <p className="text-sm text-error">{errors.root.message}</p>
              </div>
            )}
          </div>
        </form>

        {uploadedVideo && (
          <div className="mt-6 p-4 bg-success/10 border border-success/20 rounded-lg">
            <h3 className="text-lg font-bold flex items-center text-success mb-3">
              <FiCheck className="mr-2 h-5 w-5" />
              Video Uploaded Successfully!
            </h3>
            <div className="text-sm text-base-content space-y-1">
              <div>
                <span className="font-medium">Duration:</span>{" "}
                {uploadedVideo.duration} seconds
              </div>
              <div>
                <span className="font-medium">Uploaded at:</span>{" "}
                {new Date(uploadedVideo.uploadedAt).toLocaleString()}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoUploadModal;
