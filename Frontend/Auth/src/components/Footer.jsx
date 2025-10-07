import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-base-200 text-base-content">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Project Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-primary-content"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-base-content">
                AlgoMaster
              </h3>
            </div>
            <p className="text-base-content/70 text-sm leading-relaxed">
              A modern competitive programming platform that combines
              algorithmic problem-solving with social networking and real-time
              collaboration. Master algorithms while building meaningful
              connections in the coding community. Built by{" "}
              <span className="text-primary font-medium">Dhanush Kumar</span>.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com/DHANUSH59-CPU"
                target="_blank"
                rel="noopener noreferrer"
                className="text-base-content/60 hover:text-primary transition-colors duration-200"
                aria-label="GitHub Profile"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/in/dhanush-kumar-11b994333"
                target="_blank"
                rel="noopener noreferrer"
                className="text-base-content/60 hover:text-primary transition-colors duration-200"
                aria-label="LinkedIn Profile"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-base-content">
              Key Features
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-base-content/70">
                  Real-time Collaborative Coding
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                <span className="text-base-content/70">
                  AI-Powered Problem Solving
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <span className="text-base-content/70">
                  Social Networking & Discovery
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-info rounded-full"></div>
                <span className="text-base-content/70">
                  Comprehensive Analytics
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span className="text-base-content/70">
                  Progressive Web App
                </span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-base-content">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/problems"
                  className="text-base-content/70 hover:text-primary transition-colors duration-200"
                >
                  Problems Arena
                </Link>
              </li>
              <li>
                <Link
                  to="/leaderboard"
                  className="text-base-content/70 hover:text-primary transition-colors duration-200"
                >
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link
                  to="/sprints"
                  className="text-base-content/70 hover:text-primary transition-colors duration-200"
                >
                  Learning Sprints
                </Link>
              </li>
              <li>
                <Link
                  to="/collaborate"
                  className="text-base-content/70 hover:text-primary transition-colors duration-200"
                >
                  Collaborative Coding
                </Link>
              </li>
              <li>
                <Link
                  to="/discover"
                  className="text-base-content/70 hover:text-primary transition-colors duration-200"
                >
                  Discover Friends
                </Link>
              </li>
            </ul>
          </div>

          {/* Tech Stack */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-base-content">
              Built With
            </h4>
            <div className="space-y-3">
              <div>
                <h5 className="text-sm font-medium text-base-content mb-2">
                  Frontend
                </h5>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full">
                    React
                  </span>
                  <span className="px-2 py-1 bg-secondary/20 text-secondary text-xs rounded-full">
                    Vite
                  </span>
                  <span className="px-2 py-1 bg-accent/20 text-accent text-xs rounded-full">
                    Tailwind
                  </span>
                  <span className="px-2 py-1 bg-info/20 text-info text-xs rounded-full">
                    Redux
                  </span>
                </div>
              </div>
              <div>
                <h5 className="text-sm font-medium text-base-content mb-2">
                  Backend
                </h5>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full">
                    Node.js
                  </span>
                  <span className="px-2 py-1 bg-secondary/20 text-secondary text-xs rounded-full">
                    Express
                  </span>
                  <span className="px-2 py-1 bg-accent/20 text-accent text-xs rounded-full">
                    MongoDB
                  </span>
                  <span className="px-2 py-1 bg-info/20 text-info text-xs rounded-full">
                    Socket.IO
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Developer Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-base-content">
              Developer
            </h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                  <span className="text-primary-content font-bold text-sm">
                    DK
                  </span>
                </div>
                <div>
                  <h5 className="font-medium text-base-content">
                    Dhanush Kumar
                  </h5>
                  <p className="text-sm text-base-content/70">
                    Full Stack Developer
                  </p>
                </div>
              </div>
              <p className="text-sm text-base-content/70">
                Passionate about building innovative solutions and contributing
                to the developer community.
              </p>
              <div className="flex space-x-3">
                <a
                  href="https://github.com/DHANUSH59-CPU"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-sm text-base-content/70 hover:text-primary transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  <span>GitHub</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/dhanush-kumar-11b994333"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-sm text-base-content/70 hover:text-primary transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-base-300 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-base-content/60">
              © 2025 AlgoMaster. Built with ❤️ for the coding community.
            </div>
            <div className="flex items-center space-x-6 text-sm text-base-content/60">
              <span>Master algorithms, build connections, grow together.</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
