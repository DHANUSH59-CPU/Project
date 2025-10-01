import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axiosClient from "../../utils/axios";
import { useNavigate } from "react-router";
import { FiPlus, FiTrash2, FiCode, FiSave, FiCheck, FiX } from "react-icons/fi";

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
    .min(1, "At least one hidden test case required"),
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

function AdminPanel() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      startCode: [
        { language: "C++", initialCode: "" },
        { language: "Java", initialCode: "" },
        { language: "JavaScript", initialCode: "" },
      ],
      referenceSolution: [
        { language: "C++", completeCode: "" },
        { language: "Java", completeCode: "" },
        { language: "JavaScript", completeCode: "" },
      ],
    },
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

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await axiosClient.post("/problem/create", data);
      alert("Problem created successfully!");
      navigate("/");
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

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
          Create New Problem
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full animate-pulse"></div>
        <p className="text-base-content/70 mt-4 text-lg animate-fade-in delay-200">
          Build the next coding challenge
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8 max-w-4xl mx-auto relative z-10"
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
                      placeholder="Enter test input (multi-line supported)...&#10;Example:&#10;6&#10;1 3 5 7 9 11&#10;5"
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
                      placeholder="Enter expected output...&#10;Example: 2"
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
                      placeholder="Enter test input (multi-line supported)...&#10;Example:&#10;6&#10;1 3 5 7 9 11&#10;5"
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
                      placeholder="Enter expected output...&#10;Example: 2"
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
              Ready to publish your problem?
            </h3>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`btn btn-primary btn-lg w-full max-w-md mx-auto transition-all duration-300 shadow-lg hover:shadow-xl ${
                isSubmitting
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:scale-105"
              }`}
              style={{
                background: "linear-gradient(135deg, #3b82f6, #10b981)",
                border: "none",
                boxShadow: "0 4px 15px rgba(59, 130, 246, 0.3)",
              }}
            >
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Creating Problem...
                </>
              ) : (
                <>
                  <FiSave className="w-5 h-5" />
                  Create Problem
                </>
              )}
            </button>
            <p className="text-sm opacity-70 mt-2">
              {isSubmitting
                ? "Please wait while we create your problem..."
                : "Make sure all fields are filled correctly"}
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AdminPanel;
