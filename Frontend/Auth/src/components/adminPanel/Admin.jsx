import React from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

const Admin = () => {
  const adminOptions = [
    {
      id: "create",
      title: "Create Problem",
      description: "Add a new coding problem to the platform",
      icon: Plus,
      route: "/admin/create",
    },
    {
      id: "update",
      title: "Update Problem",
      description: "Edit existing problems and their details",
      icon: Edit,
      route: "/admin/update",
    },
    {
      id: "delete",
      title: "Delete Problem",
      description: "Remove problems from the platform",
      icon: Trash2,
      route: "/admin/delete",
    },
    {
      id: "createBlog",
      title: "Create Blog",
      description: "Add your blogs",
      icon: Plus,
      route: "/admin/blog/create",
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="text-center mt-10">
        <h1 className="text-4xl font-extrabold tracking-widest text-base-content drop-shadow-lg animate-pulse">
          Admin Panel
        </h1>
        <p className="mt-2 text-center text-gray-500 text-lg italic tracking-wide">
          Manage coding problems and content on your platform
        </p>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 px-6 max-w-6xl mx-auto">
        {adminOptions.map(({ id, title, description, icon: Icon, route }) => (
          <div
            key={id}
            className="card shadow-lg border border-base-300 transition hover:shadow-xl bg-base-300"
          >
            <div className="card-body">
              {/* Icon + Title */}
              <div className="flex items-center gap-3">
                <Icon className="w-6 h-6 text-primary" />
                <h2 className="card-title">{title}</h2>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-500">{description}</p>

              {/* Action */}
              <div className="card-actions justify-end">
                <Link to={route} className="btn btn-sm btn-primary">
                  Go
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;
