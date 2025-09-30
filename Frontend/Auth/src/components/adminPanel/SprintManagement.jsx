import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Eye, ToggleLeft, ToggleRight } from "lucide-react";
import axiosClient from "../../utils/axios";

const SprintManagement = () => {
  const [sprints, setSprints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingSprint, setEditingSprint] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Arrays",
    difficulty: "Beginner",
    problems: [],
    estimatedTime: 60,
    points: 100,
    tags: [],
    prerequisites: [],
    learningObjectives: [],
    completionReward: {
      type: "points",
      value: 100,
    },
  });

  const categories = [
    "Arrays",
    "Strings",
    "Dynamic Programming",
    "Graphs",
    "Trees",
    "Sorting",
    "Searching",
    "Greedy",
    "Backtracking",
    "Math",
    "Bit Manipulation",
    "Two Pointers",
    "Sliding Window",
    "Stack",
    "Queue",
    "Hash Table",
    "Linked List",
    "Binary Search",
    "Recursion",
  ];

  const difficulties = ["Beginner", "Intermediate", "Advanced"];

  useEffect(() => {
    fetchSprints();
  }, []);

  const fetchSprints = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get("/sprint/admin/all");
      setSprints(response.data.sprints);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching sprints:", error);
      setLoading(false);
    }
  };

  const handleCreateSprint = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post("/sprint/admin/create", formData);
      setShowCreateForm(false);
      setFormData({
        title: "",
        description: "",
        category: "Arrays",
        difficulty: "Beginner",
        problems: [],
        estimatedTime: 60,
        points: 100,
        tags: [],
        prerequisites: [],
        learningObjectives: [],
        completionReward: {
          type: "points",
          value: 100,
        },
      });
      fetchSprints();
    } catch (error) {
      console.error("Error creating sprint:", error);
      alert("Failed to create sprint. Please try again.");
    }
  };

  const handleToggleStatus = async (sprintId, currentStatus) => {
    try {
      await axiosClient.patch(`/sprint/admin/${sprintId}/toggle`, {
        isActive: !currentStatus,
      });
      fetchSprints();
    } catch (error) {
      console.error("Error toggling sprint status:", error);
    }
  };

  const handleDeleteSprint = async (sprintId) => {
    if (window.confirm("Are you sure you want to delete this sprint?")) {
      try {
        await axiosClient.delete(`/sprint/admin/${sprintId}`);
        fetchSprints();
      } catch (error) {
        console.error("Error deleting sprint:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-base-content">
          Sprint Management
        </h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4" />
          Create Sprint
        </button>
      </div>

      {/* Create Sprint Form */}
      {showCreateForm && (
        <div className="bg-base-100 rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Create New Sprint</h3>
          <form onSubmit={handleCreateSprint} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">
                  <span className="label-text">Title</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="input input-bordered w-full"
                  required
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text">Category</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="select select-bordered w-full"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">
                  <span className="label-text">Difficulty</span>
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) =>
                    setFormData({ ...formData, difficulty: e.target.value })
                  }
                  className="select select-bordered w-full"
                >
                  {difficulties.map((difficulty) => (
                    <option key={difficulty} value={difficulty}>
                      {difficulty}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">
                  <span className="label-text">Estimated Time (minutes)</span>
                </label>
                <input
                  type="number"
                  value={formData.estimatedTime}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      estimatedTime: parseInt(e.target.value),
                    })
                  }
                  className="input input-bordered w-full"
                  min="5"
                  max="480"
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text">Points</span>
                </label>
                <input
                  type="number"
                  value={formData.points}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      points: parseInt(e.target.value),
                    })
                  }
                  className="input input-bordered w-full"
                  min="10"
                  max="1000"
                />
              </div>
            </div>

            <div>
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="textarea textarea-bordered w-full"
                rows="3"
                required
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="btn btn-ghost"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Create Sprint
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Sprints List */}
      <div className="bg-base-100 rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Difficulty</th>
                <th>Problems</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sprints.map((sprint) => (
                <tr key={sprint._id}>
                  <td>
                    <div>
                      <div className="font-semibold">{sprint.title}</div>
                      <div className="text-sm text-base-content/70">
                        {sprint.description?.substring(0, 50)}...
                      </div>
                    </div>
                  </td>
                  <td>{sprint.category}</td>
                  <td>
                    <span
                      className={`badge ${
                        sprint.difficulty === "Beginner"
                          ? "badge-success"
                          : sprint.difficulty === "Intermediate"
                          ? "badge-warning"
                          : "badge-error"
                      }`}
                    >
                      {sprint.difficulty}
                    </span>
                  </td>
                  <td>{sprint.problems?.length || 0}</td>
                  <td>
                    <button
                      onClick={() =>
                        handleToggleStatus(sprint._id, sprint.isActive)
                      }
                      className={`btn btn-sm ${
                        sprint.isActive ? "btn-success" : "btn-error"
                      }`}
                    >
                      {sprint.isActive ? (
                        <>
                          <ToggleRight className="w-4 h-4" />
                          Active
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-4 h-4" />
                          Inactive
                        </>
                      )}
                    </button>
                  </td>
                  <td>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingSprint(sprint)}
                        className="btn btn-sm btn-outline"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSprint(sprint._id)}
                        className="btn btn-sm btn-error"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {sprints.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏃‍♂️</div>
          <h3 className="text-xl font-semibold text-base-content mb-2">
            No Sprints Found
          </h3>
          <p className="text-base-content/70 mb-4">
            Create your first sprint to get started!
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn btn-primary"
          >
            <Plus className="w-4 h-4" />
            Create Sprint
          </button>
        </div>
      )}
    </div>
  );
};

export default SprintManagement;
