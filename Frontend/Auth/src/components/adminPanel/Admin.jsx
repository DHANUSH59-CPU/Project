import React from "react";
import { Plus, Edit, Trash2, Users } from "lucide-react";
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
    {
      id: "sprints",
      title: "Sprint Management",
      description: "Create and manage learning sprints",
      icon: Users,
      route: "/admin/sprints",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300 p-6">
      {/* Header */}
      <div className="text-center mt-10 mb-16">
        <div className="inline-block">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-4">
            Admin Dashboard
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-primary via-secondary to-accent mx-auto rounded-full mb-4"></div>
        </div>
        <p className="text-base-content/80 text-xl font-medium max-w-2xl mx-auto leading-relaxed">
          Manage coding problems and content on your platform
        </p>
        <div className="flex justify-center gap-2 mt-4">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-secondary rounded-full animate-pulse delay-100"></div>
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse delay-200"></div>
        </div>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 px-6 max-w-7xl mx-auto">
        {adminOptions.map(({ id, title, description, icon: Icon, route }) => {
          const colorMap = {
            create: {
              gradient: "from-success/20 to-success/5",
              border: "border-success/30",
              icon: "text-success",
              button: "btn-success",
            },
            update: {
              gradient: "from-info/20 to-info/5",
              border: "border-info/30",
              icon: "text-info",
              button: "btn-info",
            },
            delete: {
              gradient: "from-error/20 to-error/5",
              border: "border-error/30",
              icon: "text-error",
              button: "btn-error",
            },
            createBlog: {
              gradient: "from-warning/20 to-warning/5",
              border: "border-warning/30",
              icon: "text-warning",
              button: "btn-warning",
            },
          };

          const colors = colorMap[id] || colorMap.create;

          return (
            <div
              key={id}
              className={`card bg-gradient-to-br ${colors.gradient} backdrop-blur-sm shadow-xl border-2 ${colors.border} hover:shadow-2xl hover:scale-105 transition-all duration-300 group cursor-pointer`}
            >
              <div className="card-body p-8 text-center">
                {/* Icon */}
                <div className="mx-auto mb-6 relative">
                  <div
                    className={`w-16 h-16 rounded-full bg-gradient-to-br from-base-100 to-base-200 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 ${colors.border} border-2`}
                  >
                    <Icon
                      className={`w-8 h-8 ${colors.icon} group-hover:scale-110 transition-transform duration-300`}
                    />
                  </div>
                  <div
                    className={`absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br ${colors.gradient} rounded-full border-2 ${colors.border} opacity-80`}
                  ></div>
                </div>

                {/* Title */}
                <h2 className="card-title text-xl font-bold mb-3 justify-center group-hover:text-base-content transition-colors duration-300">
                  {title}
                </h2>

                {/* Description */}
                <p className="text-base-content/70 text-sm leading-relaxed mb-6 min-h-[3rem] flex items-center justify-center">
                  {description}
                </p>

                {/* Action */}
                <div className="card-actions justify-center">
                  <Link
                    to={route}
                    className={`btn ${colors.button} btn-sm px-8 hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl`}
                  >
                    <span className="font-semibold">Launch</span>
                    <svg
                      className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Admin;
