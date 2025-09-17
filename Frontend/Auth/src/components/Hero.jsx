import React from "react";
import { useNavigate } from "react-router";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Welcome to CodeAI</h1>
            <p className="py-6">
              Join CodeAI to practice coding, compete with peers, and elevate
              your problem-solving abilities to new heights.
            </p>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/problems")}
            >
              Explore Problems
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
