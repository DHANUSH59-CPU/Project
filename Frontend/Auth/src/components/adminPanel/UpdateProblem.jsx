import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axiosClient from "../../utils/axios";
import { useNavigate } from "react-router";
import {
  FiSearch,
  FiEdit3,
  FiPlus,
  FiTrash2,
  FiEye,
  FiEyeOff,
  FiCode,
  FiSave,
  FiArrowLeft,
  FiCheck,
  FiX,
  FiVideo,
} from "react-icons/fi";
import VideoUploadModal from "./VideoUploadModal";

const problemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  difficulty: z.enum(["easy", "medium", "hard"]),
  tags: z.enum(["array", "linkedList", "graph", "dp"]),
  visibleTestCases: z
    .array(
      z.object({
        input: z.string().min(1, "Input is required"),
        output: z.string().min(1, "Output is required"),
        explanation: z.string().min(1, "Explanation is required"),
      })
    )
    .min(1, "At least one visible test case required"),
  hiddenTestCases: z
    .array(
      z.object({
        input: z.string().min(1, "Input is required"),
        output: z.string().min(1, "Output is required"),
      })
    )
    .optional(),
  startCode: z
    .array(
      z.object({
        language: z.enum(["C++", "Java", "JavaScript"]),
        initialCode: z.string().min(1, "Initial code is required"),
      })
    )
    .length(3, "All three languages required"),
  referenceSolution: z
    .array(
      z.object({
        language: z.enum(["C++", "Java", "JavaScript"]),
        completeCode: z.string().min(1, "Complete code is required"),
      })
    )
    .length(3, "All three languages required"),
});

function UpdateProblem() {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [showVideoUpload, setShowVideoUpload] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(problemSchema),
  });

  const {
    fields: visibleFields,
    append: appendVisible,
    remove: removeVisible,
  } = useFieldArray({
    control,
    name: "visibleTestCases",
  });

  const {
    fields: hiddenFields,
    append: appendHidden,
    remove: removeHidden,
  } = useFieldArray({
    control,
    name: "hiddenTestCases",
  });

  // Fetch all problems on component mount
  useEffect(() => {
    fetchAllProblems();
  }, []);

  const fetchAllProblems = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get("/problem/allProblems");
      setProblems(response.data);
    } catch (error) {
      alert(
        `Error fetching problems: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchProblemDetails = async (problemId) => {
    try {
      setLoading(true);
      const response = await axiosClient.get(
        `/problem/problemById/${problemId}`
      );
      const problem = response.data;
      setSelectedProblem(problem);

      // First, reset the basic form fields
      reset({
        title: problem.title,
        description: problem.description,
        difficulty: problem.difficulty,
        tags: problem.tags,
        visibleTestCases: [], // Start with empty arrays
        hiddenTestCases: [], // Start with empty arrays
        startCode: problem.startCode || [
          { language: "C++", initialCode: "" },
          { language: "Java", initialCode: "" },
          { language: "JavaScript", initialCode: "" },
        ],
        referenceSolution: problem.referenceSolution || [
          { language: "C++", completeCode: "" },
          { language: "Java", completeCode: "" },
          { language: "JavaScript", completeCode: "" },
        ],
      });

      // Clear existing field arrays
      while (visibleFields.length > 0) {
        removeVisible(0);
      }
      while (hiddenFields.length > 0) {
        removeHidden(0);
      }

      // Populate visible test cases
      const visibleTestCases =
        problem.visibleTestCases && problem.visibleTestCases.length > 0
          ? problem.visibleTestCases
          : [{ input: "", output: "", explanation: "" }];

      visibleTestCases.forEach((testCase) => {
        appendVisible(testCase);
      });

      // Populate hidden test cases
      const hiddenTestCases =
        problem.hiddenTestCases && problem.hiddenTestCases.length > 0
          ? problem.hiddenTestCases
          : [{ input: "", output: "" }];

      hiddenTestCases.forEach((testCase) => {
        appendHidden(testCase);
      });
    } catch (error) {
      alert(
        `Error fetching problem details: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    console.log("🚀 Form submitted with data:", data);
    console.log("📋 Form errors:", errors);
    console.log("🎯 Selected problem:", selectedProblem);
    console.log(
      "🧪 Visible test cases count:",
      data.visibleTestCases?.length || 0
    );
    console.log(
      "🔒 Hidden test cases count:",
      data.hiddenTestCases?.length || 0
    );

    // Check specific validation issues
    if (!data.hiddenTestCases || data.hiddenTestCases.length === 0) {
      console.log("❌ No hidden test cases found - this will fail validation!");
    }

    if (!selectedProblem) {
      console.log("❌ No problem selected");
      alert("Please select a problem to update");
      return;
    }

    console.log("✅ Starting API call...");

    try {
      setIsUpdating(true);
      await axiosClient.put(`/problem/update/${selectedProblem._id}`, data);
      alert("Problem updated successfully!");

      // Reset form and go back to problem selection
      setSelectedProblem(null);
      reset();
      fetchAllProblems(); // Refresh the problems list
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredProblems = problems.filter(
    (problem) =>
      problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      problem.difficulty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      problem.tags.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "text-success";
      case "medium":
        return "text-warning";
      case "hard":
        return "text-error";
      default:
        return "text-base-content";
    }
  };

  const getTagColor = (tag) => {
    switch (tag.toLowerCase()) {
      case "array":
        return "bg-orange-500/20 text-orange-500";
      case "linkedlist":
        return "bg-green-500/20 text-green-500";
      case "graph":
        return "bg-indigo-500/20 text-indigo-500";
      case "dp":
        return "bg-purple-500/20 text-purple-500";
      default:
        return "bg-gray-500/20 text-gray-500";
    }
  };

  if (!selectedProblem) {
    return (
      <div className="container mx-auto p-6 min-h-screen bg-gradient-to-br from-base-200 via-base-300 to-base-200 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
        <div className="text-center mb-12 relative z-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-4 animate-fade-in">
            Update Problem
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full animate-pulse"></div>
          <p className="text-base-content/70 mt-4 text-lg animate-fade-in delay-200">
            Select a problem to update
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8 relative z-10">
          <div className="form-control">
            <div className="input-group">
              <input
                type="text"
                placeholder="Search problems by title, difficulty, or tag..."
                className="input input-bordered w-full focus:border-primary focus:scale-105 transition-all duration-300 bg-base-100/80 backdrop-blur-sm shadow-lg hover:shadow-xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  backdropFilter: "blur(10px)",
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                }}
              />
              <button className="btn btn-square btn-primary hover:scale-110 transition-transform duration-200 shadow-lg">
                <FiSearch className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Problems List */}
        {loading ? (
          <div className="flex justify-center items-center py-12 relative z-10">
            <div className="loading loading-spinner loading-lg text-primary"></div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto relative z-10">
            <div className="grid gap-6">
              {filteredProblems.map((problem, index) => (
                <div
                  key={problem._id}
                  className="card bg-base-100/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer hover:scale-[1.02] hover:-translate-y-2 border border-white/20 hover:border-primary/30 group"
                  onClick={() => fetchProblemDetails(problem._id)}
                  style={{
                    animationDelay: `${index * 100}ms`,
                    backdropFilter: "blur(10px)",
                    background: "rgba(255, 255, 255, 0.1)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                  }}
                >
                  <div className="card-body p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="card-title text-xl mb-2 group-hover:text-primary transition-colors duration-300">
                          {problem.title}
                        </h3>
                        <p className="text-base-content/70 text-sm line-clamp-2 mb-4 group-hover:text-base-content/80 transition-colors duration-300">
                          {problem.description}
                        </p>
                        <div className="flex items-center gap-3">
                          <span
                            className={`badge badge-lg font-semibold transition-all duration-300 group-hover:scale-105 ${getDifficultyColor(
                              problem.difficulty
                            )}`}
                          >
                            {problem.difficulty.toUpperCase()}
                          </span>
                          <span
                            className={`badge badge-lg transition-all duration-300 group-hover:scale-105 ${getTagColor(
                              problem.tags
                            )}`}
                          >
                            {problem.tags}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center group-hover:scale-110 transition-transform duration-300">
                        <FiEdit3 className="w-6 h-6 text-primary group-hover:text-secondary transition-colors duration-300" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredProblems.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-base-content mb-2">
                  No problems found
                </h3>
                <p className="text-base-content/70">
                  Try adjusting your search terms.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Back Button */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate("/admin")}
            className="btn btn-outline btn-primary"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Admin Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Form rendering (same as AdminPanel but with update functionality)
  return (
    <div className="container mx-auto p-6 min-h-screen bg-gradient-to-br from-base-200 via-base-300 to-base-200 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      <div className="text-center mb-12 relative z-10">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-4 animate-fade-in">
          Update Problem: {selectedProblem.title}
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full animate-pulse"></div>
        <p className="text-base-content/70 mt-4 text-lg animate-fade-in delay-200">
          Modify the problem details below
        </p>
      </div>

      {/* Back to Selection Button */}
      <div className="mb-6">
        <button
          onClick={() => {
            setSelectedProblem(null);
            reset();
          }}
          className="btn btn-outline btn-secondary"
        >
          <FiArrowLeft className="w-4 h-4 mr-2" />
          Back to Problem Selection
        </button>
      </div>

      {/* Debug Info */}
      {selectedProblem && (
        <div className="card bg-yellow-100 border border-yellow-400 mb-6">
          <div className="card-body p-4">
            <h4 className="font-bold text-yellow-800 mb-2">
              Debug Info (Remove in production)
            </h4>
            <div className="text-sm text-yellow-700">
              <p>
                <strong>Selected Problem ID:</strong> {selectedProblem._id}
              </p>
              <p>
                <strong>Visible Fields Count:</strong> {visibleFields.length}
              </p>
              <p>
                <strong>Hidden Fields Count:</strong> {hiddenFields.length}
              </p>
              <p>
                <strong>Form Errors:</strong>{" "}
                {Object.keys(errors).length > 0 ? "Yes" : "No"}
              </p>
              <button
                type="button"
                onClick={() => {
                  const formData = getValues();
                  console.log("Current form data:", formData);
                  console.log("Form errors:", errors);
                  console.log("Selected problem:", selectedProblem);
                  console.log(
                    "Form is valid:",
                    Object.keys(errors).length === 0
                  );
                }}
                className="btn btn-warning btn-sm mt-2"
              >
                Debug Form State
              </button>
              {Object.keys(errors).length > 0 && (
                <details className="mt-2">
                  <summary className="cursor-pointer font-semibold">
                    Show Validation Errors
                  </summary>
                  <pre className="text-xs mt-2 bg-yellow-200 p-2 rounded overflow-auto">
                    {JSON.stringify(errors, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit, (errors) => {
          console.log("❌ Form validation errors:", errors);
          alert("Please check the form for errors before submitting.");
        })}
        className="space-y-8 max-w-4xl mx-auto"
      >
        {/* Basic Info */}
        <div
          className="card bg-base-100/80 backdrop-blur-sm shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 hover:border-primary/30 hover:-translate-y-1 relative z-10"
          style={{
            backdropFilter: "blur(10px)",
            background: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <div className="card-body">
            <h2 className="card-title text-2xl mb-6 flex items-center gap-3">
              <div className="w-2 h-8 bg-gradient-to-b from-primary to-secondary rounded-full"></div>
              Basic Information
            </h2>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-base">
                  Title
                </span>
              </label>
              <input
                {...register("title")}
                type="text"
                placeholder="Enter a compelling problem title..."
                className={`input input-bordered w-full transition-all duration-300 focus:scale-[1.02] focus:shadow-xl hover:shadow-lg bg-base-100/80 backdrop-blur-sm ${
                  errors.title
                    ? "input-error"
                    : "focus:border-primary focus:ring-2 focus:ring-primary/20"
                }`}
                style={{
                  backdropFilter: "blur(5px)",
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                }}
              />
              {errors.title && (
                <span className="text-error text-sm mt-1 flex items-center gap-1">
                  <span className="text-xs">⚠️</span>
                  {errors.title.message}
                </span>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-base">
                  Description
                </span>
              </label>
              <textarea
                {...register("description")}
                rows={6}
                placeholder="Provide a clear and detailed problem description with examples..."
                className={`textarea textarea-bordered w-full transition-all duration-300 focus:scale-[1.01] focus:shadow-xl hover:shadow-lg resize-none bg-base-100/80 backdrop-blur-sm ${
                  errors.description
                    ? "textarea-error"
                    : "focus:border-primary focus:ring-2 focus:ring-primary/20"
                }`}
                style={{
                  backdropFilter: "blur(5px)",
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                }}
              />
              {errors.description && (
                <span className="text-error text-sm mt-1 flex items-center gap-1">
                  <span className="text-xs">⚠️</span>
                  {errors.description.message}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-base">
                    Difficulty
                  </span>
                </label>
                <select
                  {...register("difficulty")}
                  className={`select select-bordered transition-all duration-200 focus:scale-[1.02] focus:shadow-lg ${
                    errors.difficulty ? "select-error" : "focus:border-primary"
                  }`}
                >
                  <option value="">Choose difficulty level...</option>
                  <option value="easy">🟢 Easy</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="hard">🔴 Hard</option>
                </select>
                {errors.difficulty && (
                  <span className="text-error text-sm mt-1 flex items-center gap-1">
                    <span className="text-xs">⚠️</span>
                    {errors.difficulty.message}
                  </span>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-base">
                    Category
                  </span>
                </label>
                <select
                  {...register("tags")}
                  className={`select select-bordered transition-all duration-200 focus:scale-[1.02] focus:shadow-lg ${
                    errors.tags ? "select-error" : "focus:border-primary"
                  }`}
                >
                  <option value="">Choose category...</option>
                  <option value="array">📊 Array</option>
                  <option value="linkedList">🔗 Linked List</option>
                  <option value="graph">🌐 Graph</option>
                  <option value="dp">⚡ Dynamic Programming</option>
                </select>
                {errors.tags && (
                  <span className="text-error text-sm mt-1 flex items-center gap-1">
                    <span className="text-xs">⚠️</span>
                    {errors.tags.message}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Visible Test Cases */}
        <div
          className="card bg-base-100/80 backdrop-blur-sm shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 hover:border-primary/30 hover:-translate-y-1 relative z-10"
          style={{
            backdropFilter: "blur(10px)",
            background: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <div className="card-body">
            <div className="flex items-center justify-between mb-6">
              <h2 className="card-title text-2xl flex items-center gap-3">
                <div className="w-2 h-8 bg-gradient-to-b from-success to-success/70 rounded-full"></div>
                Visible Test Cases
                <div className="badge badge-success badge-sm">Public</div>
              </h2>
              <button
                type="button"
                onClick={() =>
                  appendVisible({ input: "", output: "", explanation: "" })
                }
                className="btn btn-primary btn-sm gap-2 hover:scale-105 transition-transform duration-200"
              >
                <FiPlus className="w-4 h-4" />
                Add Case
              </button>
            </div>
            {visibleFields.map((field, index) => (
              <div
                key={field.id}
                className="card bg-base-200/80 backdrop-blur-sm shadow-lg border border-white/20 hover:shadow-xl transition-all duration-500 mt-4 p-6 hover:border-success/30 hover:scale-[1.01] hover:-translate-y-1"
                style={{
                  backdropFilter: "blur(5px)",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <span className="w-6 h-6 bg-success text-success-content rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                    Test Case {index + 1}
                  </h3>
                  <button
                    type="button"
                    onClick={() => removeVisible(index)}
                    className="btn btn-error btn-xs hover:scale-110 transition-transform duration-200"
                  >
                    <FiX className="w-3 h-3" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Input</span>
                      <span className="label-text-alt text-xs opacity-70">
                        Multi-line supported
                      </span>
                    </label>
                    <textarea
                      {...register(`visibleTestCases.${index}.input`)}
                      placeholder="Enter test input (multi-line supported)..."
                      className="textarea textarea-bordered w-full focus:border-success transition-colors duration-200 font-mono text-sm"
                      rows={4}
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">
                        Expected Output
                      </span>
                      <span className="label-text-alt text-xs opacity-70">
                        Single or multi-line
                      </span>
                    </label>
                    <textarea
                      {...register(`visibleTestCases.${index}.output`)}
                      placeholder="Enter expected output..."
                      className="textarea textarea-bordered w-full focus:border-success transition-colors duration-200 font-mono text-sm"
                      rows={2}
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">
                        Explanation
                      </span>
                    </label>
                    <textarea
                      {...register(`visibleTestCases.${index}.explanation`)}
                      placeholder="Explain how this test case works..."
                      className="textarea textarea-bordered w-full focus:border-success transition-colors duration-200 resize-none"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hidden Test Cases */}
        <div
          className="card bg-base-100/80 backdrop-blur-sm shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 hover:border-primary/30 hover:-translate-y-1 relative z-10"
          style={{
            backdropFilter: "blur(10px)",
            background: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <div className="card-body">
            <div className="flex items-center justify-between mb-6">
              <h2 className="card-title text-2xl flex items-center gap-3">
                <div className="w-2 h-8 bg-gradient-to-b from-warning to-warning/70 rounded-full"></div>
                Hidden Test Cases
                <div className="badge badge-warning badge-sm">Private</div>
              </h2>
              <button
                type="button"
                onClick={() => appendHidden({ input: "", output: "" })}
                className="btn btn-primary btn-sm gap-2 hover:scale-105 transition-transform duration-200"
              >
                <FiPlus className="w-4 h-4" />
                Add Case
              </button>
            </div>
            {hiddenFields.map((field, index) => (
              <div
                key={field.id}
                className="card bg-base-200/80 backdrop-blur-sm shadow-lg border border-white/20 hover:shadow-xl transition-all duration-500 mt-4 p-6 hover:border-warning/30 hover:scale-[1.01] hover:-translate-y-1"
                style={{
                  backdropFilter: "blur(5px)",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <span className="w-6 h-6 bg-warning text-warning-content rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                    Hidden Case {index + 1}
                  </h3>
                  <button
                    type="button"
                    onClick={() => removeHidden(index)}
                    className="btn btn-error btn-xs hover:scale-110 transition-transform duration-200"
                  >
                    <FiX className="w-3 h-3" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Input</span>
                      <span className="label-text-alt text-xs opacity-70">
                        Multi-line supported
                      </span>
                    </label>
                    <textarea
                      {...register(`hiddenTestCases.${index}.input`)}
                      placeholder="Enter test input (multi-line supported)..."
                      className="textarea textarea-bordered w-full focus:border-warning transition-colors duration-200 font-mono text-sm"
                      rows={4}
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">
                        Expected Output
                      </span>
                      <span className="label-text-alt text-xs opacity-70">
                        Single or multi-line
                      </span>
                    </label>
                    <textarea
                      {...register(`hiddenTestCases.${index}.output`)}
                      placeholder="Enter expected output..."
                      className="textarea textarea-bordered w-full focus:border-warning transition-colors duration-200 font-mono text-sm"
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Code Templates */}
        <div
          className="card bg-base-100/80 backdrop-blur-sm shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 hover:border-primary/30 hover:-translate-y-1 relative z-10"
          style={{
            backdropFilter: "blur(10px)",
            background: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <div className="card-body">
            <h2 className="card-title text-2xl mb-6 flex items-center gap-3">
              <div className="w-2 h-8 bg-gradient-to-b from-info to-info/70 rounded-full"></div>
              Code Templates
              <div className="badge badge-info badge-sm">Multi-Language</div>
            </h2>
            <div className="grid gap-6">
              {["C++", "Java", "JavaScript"].map((lang, index) => {
                const langIcons = {
                  "C++": "⚡",
                  Java: "☕",
                  JavaScript: "🟨",
                };
                return (
                  <div
                    key={lang}
                    className="card bg-base-200 border border-base-300 hover:border-info/30 transition-all duration-300"
                  >
                    <div className="card-body p-6">
                      <h3 className="font-bold text-xl mb-4 flex items-center gap-3">
                        <span className="text-2xl">{langIcons[lang]}</span>
                        {lang}
                      </h3>
                      <div className="space-y-4">
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-medium">
                              Initial Code Template
                            </span>
                            <span className="label-text-alt text-xs opacity-70">
                              Starter code for users
                            </span>
                          </label>
                          <textarea
                            {...register(`startCode.${index}.initialCode`)}
                            placeholder={`// ${lang} starter template\n// Write your initial code structure here...`}
                            className="textarea textarea-bordered w-full font-mono text-sm bg-base-100 focus:border-info transition-colors duration-200 resize-none"
                            rows={6}
                          />
                        </div>
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-medium">
                              Reference Solution
                            </span>
                            <span className="label-text-alt text-xs opacity-70">
                              Complete working solution
                            </span>
                          </label>
                          <textarea
                            {...register(
                              `referenceSolution.${index}.completeCode`
                            )}
                            placeholder={`// ${lang} complete solution\n// Write the full working solution here...`}
                            className="textarea textarea-bordered w-full font-mono text-sm bg-base-100 focus:border-info transition-colors duration-200 resize-none"
                            rows={8}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Video Upload Section */}
        {selectedProblem && (
          <div
            className="card bg-gradient-to-r from-info/10 to-info/5 border border-info/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.01] hover:-translate-y-1 relative z-10 backdrop-blur-sm"
            style={{
              backdropFilter: "blur(10px)",
              background:
                "linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(6, 182, 212, 0.05))",
              border: "1px solid rgba(6, 182, 212, 0.2)",
            }}
          >
            <div className="card-body text-center">
              <h3 className="text-lg font-semibold mb-4 flex items-center justify-center gap-2">
                <FiVideo className="w-5 h-5 text-info" />
                Video Solution
              </h3>
              <p className="text-sm opacity-70 mb-4">
                Upload a video explanation for this problem
              </p>
              <button
                type="button"
                onClick={() => setShowVideoUpload(true)}
                className="btn btn-info btn-lg hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                style={{
                  background: "linear-gradient(135deg, #06b6d4, #0891b2)",
                  border: "none",
                  boxShadow: "0 4px 15px rgba(6, 182, 212, 0.3)",
                }}
              >
                <FiVideo className="mr-2 h-5 w-5" />
                Upload Video Solution
              </button>
            </div>
          </div>
        )}

        {/* Submit */}
        <div
          className="card bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.01] hover:-translate-y-1 relative z-10 backdrop-blur-sm"
          style={{
            backdropFilter: "blur(10px)",
            background:
              "linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(16, 185, 129, 0.1))",
            border: "1px solid rgba(59, 130, 246, 0.2)",
          }}
        >
          <div className="card-body text-center">
            <h3 className="text-lg font-semibold mb-4">
              Ready to update this problem?
            </h3>
            <button
              type="submit"
              disabled={isUpdating}
              className="btn btn-primary btn-lg w-full max-w-md mx-auto hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              style={{
                background: "linear-gradient(135deg, #3b82f6, #10b981)",
                border: "none",
                boxShadow: "0 4px 15px rgba(59, 130, 246, 0.3)",
              }}
            >
              {isUpdating ? (
                <>
                  <div className="loading loading-spinner loading-sm"></div>
                  Updating Problem...
                </>
              ) : (
                <>
                  <span className="text-lg">🔄</span>
                  Update Problem
                </>
              )}
            </button>
            <p className="text-sm opacity-70 mt-2">
              Make sure all fields are filled correctly
            </p>
          </div>
        </div>
      </form>

      {/* Video Upload Modal */}
      <VideoUploadModal
        isOpen={showVideoUpload}
        onClose={() => setShowVideoUpload(false)}
        problemId={selectedProblem?._id}
        problemTitle={selectedProblem?.title}
      />
    </div>
  );
}

export default UpdateProblem;
