import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axiosClient from "../../utils/axios";
import { useNavigate } from "react-router";

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
    try {
      await axiosClient.post("/problem/create", data);
      alert("Problem created successfully!");
      navigate("/");
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="container mx-auto p-6 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Create New Problem
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Info */}
        <div className="card bg-base-200 shadow">
          <div className="card-body">
            <h2 className="card-title">Basic Information</h2>
            <div className="form-control">
              <label className="label">Title</label>
              <input
                {...register("title")}
                type="text"
                placeholder="Problem title"
                className={`input input-bordered w-full ${
                  errors.title ? "input-error" : ""
                }`}
              />
              {errors.title && (
                <span className="text-error text-sm">
                  {errors.title.message}
                </span>
              )}
            </div>

            <div className="form-control">
              <label className="label">Description</label>
              <textarea
                {...register("description")}
                rows={5}
                placeholder="Describe the problem"
                className={`textarea textarea-bordered w-full ${
                  errors.description ? "textarea-error" : ""
                }`}
              />
              {errors.description && (
                <span className="text-error text-sm">
                  {errors.description.message}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="form-control">
                <label className="label">Difficulty</label>
                <select
                  {...register("difficulty")}
                  className={`select select-bordered ${
                    errors.difficulty ? "select-error" : ""
                  }`}
                >
                  <option value="">Select...</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label">Tag</label>
                <select
                  {...register("tags")}
                  className={`select select-bordered ${
                    errors.tags ? "select-error" : ""
                  }`}
                >
                  <option value="">Select...</option>
                  <option value="array">Array</option>
                  <option value="linkedList">Linked List</option>
                  <option value="graph">Graph</option>
                  <option value="dp">DP</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Visible Test Cases */}
        <div className="card bg-base-200 shadow">
          <div className="card-body">
            <h2 className="card-title">Visible Test Cases</h2>
            <button
              type="button"
              onClick={() =>
                appendVisible({ input: "", output: "", explanation: "" })
              }
              className="btn btn-primary btn-sm w-fit"
            >
              + Add Case
            </button>
            {visibleFields.map((field, index) => (
              <div key={field.id} className="card bg-base-100 shadow mt-4 p-4">
                <button
                  type="button"
                  onClick={() => removeVisible(index)}
                  className="btn btn-error btn-xs self-end"
                >
                  Remove
                </button>
                <input
                  {...register(`visibleTestCases.${index}.input`)}
                  placeholder="Input"
                  className="input input-bordered w-full my-2"
                />
                <input
                  {...register(`visibleTestCases.${index}.output`)}
                  placeholder="Output"
                  className="input input-bordered w-full my-2"
                />
                <textarea
                  {...register(`visibleTestCases.${index}.explanation`)}
                  placeholder="Explanation"
                  className="textarea textarea-bordered w-full"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Hidden Test Cases */}
        <div className="card bg-base-200 shadow">
          <div className="card-body">
            <h2 className="card-title">Hidden Test Cases</h2>
            <button
              type="button"
              onClick={() => appendHidden({ input: "", output: "" })}
              className="btn btn-primary btn-sm w-fit"
            >
              + Add Case
            </button>
            {hiddenFields.map((field, index) => (
              <div key={field.id} className="card bg-base-100 shadow mt-4 p-4">
                <button
                  type="button"
                  onClick={() => removeHidden(index)}
                  className="btn btn-error btn-xs self-end"
                >
                  Remove
                </button>
                <input
                  {...register(`hiddenTestCases.${index}.input`)}
                  placeholder="Input"
                  className="input input-bordered w-full my-2"
                />
                <input
                  {...register(`hiddenTestCases.${index}.output`)}
                  placeholder="Output"
                  className="input input-bordered w-full my-2"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Code Templates */}
        <div className="card bg-base-200 shadow">
          <div className="card-body">
            <h2 className="card-title">Code Templates</h2>
            {["C++", "Java", "JavaScript"].map((lang, index) => (
              <div key={lang} className="my-4">
                <h3 className="font-bold mb-2">{lang}</h3>
                <textarea
                  {...register(`startCode.${index}.initialCode`)}
                  placeholder={`${lang} initial code`}
                  className="textarea textarea-bordered w-full my-2 font-mono"
                  rows={5}
                />
                <textarea
                  {...register(`referenceSolution.${index}.completeCode`)}
                  placeholder={`${lang} solution`}
                  className="textarea textarea-bordered w-full font-mono"
                  rows={5}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button type="submit" className="btn btn-primary w-full">
          Create Problem
        </button>
      </form>
    </div>
  );
}

export default AdminPanel;
