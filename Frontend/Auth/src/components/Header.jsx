import React from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { useTheme } from "../context/ThemeContext";
import StarBorder from "../ui/StarBorder";

const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.authSlice);
  const { theme, changeTheme, availableThemes } = useTheme();

  return (
    <div className="navbar bg-base-100 shadow-2xl relative z-50">
      <div className="flex-1">
        <StarBorder as="div" className="inline-block rounded-lg" color="cyan" speed="3s">
          <Link className="btn btn-ghost text-xl" to={"/"}>
            CodeAI
          </Link>
        </StarBorder>
      </div>

      <div>
        <StarBorder as="div" className="inline-block rounded-lg m-1" color="blue" speed="4s">
          <Link role="button" className="btn" to="/problems">
            Problems
          </Link>
        </StarBorder>
      </div>
      <div className="dropdown mx-4">
        <StarBorder as="div" className="inline-block rounded-lg" color="purple" speed="5s">
          <div tabIndex={0} role="button" className="btn m-1">
            Theme
            <svg
              width="12px"
              height="12px"
              className="inline-block h-2 w-2 fill-current opacity-60"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 2048 2048"
            >
              <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
            </svg>
          </div>
        </StarBorder>
        <ul
          tabIndex={0}
          className="dropdown-content bg-base-300 rounded-box z-[60] w-40 p-2 shadow-2xl"
        >
          {availableThemes.map((themeName) => (
            <li key={themeName}>
              <input
                type="radio"
                name="theme-dropdown"
                className="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start"
                aria-label={themeName}
                value={themeName}
                checked={theme === themeName}
                onChange={() => changeTheme(themeName)}
              />
            </li>
          ))}
        </ul>
      </div>
      <div className="dropdown dropdown-end">
        <StarBorder as="div" className="inline-block rounded-full" color="pink" speed="6s">
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
            <a className="justify-between">
              Profile
              <span className="badge">New</span>
            </a>
          </li>
          <li>
            <a>Settings</a>
          </li>
          <li>
            <a onClick={() => navigate("/logout")}>Logout</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Header;
