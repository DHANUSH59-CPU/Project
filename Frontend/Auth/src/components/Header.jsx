import { Link, useNavigate } from "react-router";
import StarBorder from "../ui/StarBorder";
import { useSelector } from "react-redux";

const Header = () => {
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.authSlice);

  return (
    <div className="navbar bg-base-100/20 backdrop-blur-md shadow-2xl relative z-50">
      <div className="flex-1">
        <StarBorder
          as="div"
          className="inline-block rounded-lg"
          color="cyan"
          speed="3s"
        >
          <Link className="btn btn-ghost text-xl" to={"/"}>
            AlgoMaster
          </Link>
        </StarBorder>
      </div>

      <div className="flex space-x-2">
        <StarBorder
          as="div"
          className="inline-block rounded-lg m-1 mx-2"
          color="blue"
          speed="4s"
        >
          <Link role="button" className="btn" to="/problems">
            Problems
          </Link>
        </StarBorder>

        <StarBorder
          as="div"
          className="inline-block rounded-lg m-1 mx-2"
          color="green"
          speed="5s"
        >
          <Link role="button" className="btn" to="/leaderboard">
            Leaderboard
          </Link>
        </StarBorder>

        <StarBorder
          as="div"
          className="inline-block rounded-lg m-1 mx-2"
          color="purple"
          speed="4s"
        >
          <Link role="button" className="btn" to="/discover">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{
                filter: "drop-shadow(0 1px 2px rgba(168, 85, 247, 0.3))",
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            Discover Friends
          </Link>
        </StarBorder>

        <StarBorder
          as="div"
          className="inline-block rounded-lg m-1 mx-2"
          color="purple"
          speed="3s"
        >
          <Link role="button" className="btn" to="/collaborate">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{
                filter: "drop-shadow(0 1px 2px rgba(147, 51, 234, 0.3))",
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Collaborate
          </Link>
        </StarBorder>
      </div>

      <div className="dropdown dropdown-end">
        <StarBorder
          as="div"
          className="inline-block rounded-full"
          color="pink"
          speed="6s"
        >
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <img
                alt="User profile"
                src={
                  user?.profileImageUrl ||
                  user?.profile_img ||
                  "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                }
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </StarBorder>
        <ul
          tabIndex={0}
          className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[60] mt-3 w-52 p-2 shadow"
        >
          <li>
            <a onClick={() => navigate("/profile")} className="justify-between">
              <div className="flex items-center space-x-2">
                <div
                  className="p-1 rounded-full bg-primary/20"
                  style={{
                    filter: "drop-shadow(0 2px 4px rgba(59, 130, 246, 0.3))",
                    transform:
                      "perspective(1000px) rotateX(15deg) rotateY(-5deg)",
                  }}
                >
                  <svg
                    className="w-4 h-4 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    style={{
                      filter: "drop-shadow(0 1px 2px rgba(59, 130, 246, 0.4))",
                    }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <span>Profile</span>
              </div>
              <span className="badge">New</span>
            </a>
          </li>
          <li>
            <a
              onClick={() => navigate("/social/liked")}
              className="flex items-center space-x-2"
            >
              <div
                className="p-1 rounded-full bg-error/20"
                style={{
                  filter: "drop-shadow(0 2px 4px rgba(239, 68, 68, 0.3))",
                  transform:
                    "perspective(1000px) rotateX(15deg) rotateY(-5deg)",
                }}
              >
                <svg
                  className="w-4 h-4 text-error"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  style={{
                    filter: "drop-shadow(0 1px 2px rgba(239, 68, 68, 0.4))",
                  }}
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>
              <span>Liked Problems</span>
            </a>
          </li>
          <li>
            <a
              onClick={() => navigate("/social/favorites")}
              className="flex items-center space-x-2"
            >
              <div
                className="p-1 rounded-full bg-warning/20"
                style={{
                  filter: "drop-shadow(0 2px 4px rgba(245, 158, 11, 0.3))",
                  transform:
                    "perspective(1000px) rotateX(15deg) rotateY(-5deg)",
                }}
              >
                <svg
                  className="w-4 h-4 text-warning"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  style={{
                    filter: "drop-shadow(0 1px 2px rgba(245, 158, 11, 0.4))",
                  }}
                >
                  <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </div>
              <span>Favorites</span>
            </a>
          </li>
          <li>
            <a
              onClick={() => navigate("/requests")}
              className="flex items-center space-x-2"
            >
              <div
                className="p-1 rounded-full bg-info/20"
                style={{
                  filter: "drop-shadow(0 2px 4px rgba(59, 130, 246, 0.3))",
                  transform:
                    "perspective(1000px) rotateX(15deg) rotateY(-5deg)",
                }}
              >
                <svg
                  className="w-4 h-4 text-info"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  style={{
                    filter: "drop-shadow(0 1px 2px rgba(59, 130, 246, 0.4))",
                  }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
              </div>
              <span>Requests</span>
            </a>
          </li>
          <li>
            <a
              onClick={() => navigate("/connections")}
              className="flex items-center space-x-2"
            >
              <div
                className="p-1 rounded-full bg-success/20"
                style={{
                  filter: "drop-shadow(0 2px 4px rgba(34, 197, 94, 0.3))",
                  transform:
                    "perspective(1000px) rotateX(15deg) rotateY(-5deg)",
                }}
              >
                <svg
                  className="w-4 h-4 text-success"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  style={{
                    filter: "drop-shadow(0 1px 2px rgba(34, 197, 94, 0.4))",
                  }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <span>Connections</span>
            </a>
          </li>
          <li>
            <a
              onClick={() => navigate("/sprints")}
              className="flex items-center space-x-2"
            >
              <div
                className="p-1 rounded-full bg-success/20"
                style={{
                  filter: "drop-shadow(0 2px 4px rgba(34, 197, 94, 0.3))",
                  transform:
                    "perspective(1000px) rotateX(15deg) rotateY(-5deg)",
                }}
              >
                <svg
                  className="w-4 h-4 text-success"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  style={{
                    filter: "drop-shadow(0 1px 2px rgba(34, 197, 94, 0.4))",
                  }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <span>Sprints</span>
            </a>
          </li>
          <li>
            <a
              onClick={() => navigate("/leaderboard")}
              className="flex items-center space-x-2"
            >
              <div
                className="p-1 rounded-full bg-warning/20"
                style={{
                  filter: "drop-shadow(0 2px 4px rgba(245, 158, 11, 0.3))",
                  transform:
                    "perspective(1000px) rotateX(15deg) rotateY(-5deg)",
                }}
              >
                <svg
                  className="w-4 h-4 text-warning"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  style={{
                    filter: "drop-shadow(0 1px 2px rgba(245, 158, 11, 0.4))",
                  }}
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <span>Leaderboard</span>
            </a>
          </li>
          {user?.role === "admin" && (
            <li>
              <a
                onClick={() => navigate("/admin")}
                className="flex items-center space-x-2"
              >
                <div
                  className="p-1 rounded-full bg-secondary/20"
                  style={{
                    filter: "drop-shadow(0 2px 4px rgba(168, 85, 247, 0.3))",
                    transform:
                      "perspective(1000px) rotateX(15deg) rotateY(-5deg)",
                  }}
                >
                  <svg
                    className="w-4 h-4 text-secondary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    style={{
                      filter: "drop-shadow(0 1px 2px rgba(168, 85, 247, 0.4))",
                    }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <span>Admin</span>
              </a>
            </li>
          )}
          <li>
            <a
              onClick={() => navigate("/logout")}
              className="flex items-center space-x-2"
            >
              <div
                className="p-1 rounded-full bg-error/20"
                style={{
                  filter: "drop-shadow(0 2px 4px rgba(239, 68, 68, 0.3))",
                  transform:
                    "perspective(1000px) rotateX(15deg) rotateY(-5deg)",
                }}
              >
                <svg
                  className="w-4 h-4 text-error"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  style={{
                    filter: "drop-shadow(0 1px 2px rgba(239, 68, 68, 0.4))",
                  }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </div>
              <span>Logout</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Header;
