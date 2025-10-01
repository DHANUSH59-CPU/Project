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
            CodeAI
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
                alt="Tailwind CSS Navbar component"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
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
              Profile
              <span className="badge">New</span>
            </a>
          </li>
          <li>
            <a
              onClick={() => navigate("/social/liked")}
              className="flex items-center space-x-2"
            >
              <span>❤️</span>
              <span>Liked Problems</span>
            </a>
          </li>
          <li>
            <a
              onClick={() => navigate("/social/favorites")}
              className="flex items-center space-x-2"
            >
              <span>⭐</span>
              <span>Favorites</span>
            </a>
          </li>
          <li>
            <a
              onClick={() => navigate("/sprints")}
              className="flex items-center space-x-2"
            >
              <span>🏃‍♂️</span>
              <span>Sprints</span>
            </a>
          </li>
          <li>
            <a
              onClick={() => navigate("/leaderboard")}
              className="flex items-center space-x-2"
            >
              <span>🏆</span>
              <span>Leaderboard</span>
            </a>
          </li>
          {user?.role === "admin" && (
            <li>
              <a onClick={() => navigate("/admin")}>Admin</a>
            </li>
          )}
          <li>
            <a onClick={() => navigate("/logout")}>Logout</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Header;
