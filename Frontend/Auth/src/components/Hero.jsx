import React from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* Hero Section */}
      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content text-center">
          <motion.div
            className="max-w-md"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl font-bold">Welcome to CodeAI</h1>
            <p className="py-6">
              Join CodeAI to practice coding, compete with peers, and elevate
              your problem-solving abilities to new heights.
            </p>
            <motion.button
              className="btn btn-primary"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate("/problems")}
            >
              Explore Problems
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-base-300 p-20">
        <motion.h1
          className="font-bold text-4xl text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          Everything You Need to Excel
        </motion.h1>
        <motion.p
          className="text-center mt-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          CodeAI provides a comprehensive suite of tools and resources to help
          you on your coding journey.
        </motion.p>

        {/* Cards with animations */}
        <div className="flex items-center justify-center m-10 gap-5 flex-wrap">
          {[1, 2, 3].map((item, i) => (
            <motion.div
              key={i}
              className="card bg-base-100 w-96 shadow-sm"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.3, duration: 0.8 }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 5px 15px rgba(0,0,0,0.2)",
              }}
            >
              <figure>
                <img
                  src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                  alt="Card"
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title">
                  Card Title
                  <div className="badge badge-secondary">NEW</div>
                </h2>
                <p>
                  A card component has a figure, a body part, and inside body
                  there are title and actions parts
                </p>
                <div className="card-actions justify-end">
                  <div className="badge badge-outline">Fashion</div>
                  <div className="badge badge-outline">Products</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Hero;
