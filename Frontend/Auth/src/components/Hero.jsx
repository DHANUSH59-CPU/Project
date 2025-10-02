import React from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Code, Trophy, Zap, BarChart3, Bot, User } from "lucide-react";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* Hero Section */}
      <div className="hero min-h-screen">
        <div className="hero-content text-center">
          <motion.div
            className="max-w-md"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl font-bold text-white drop-shadow-2xl mb-6">
              Welcome to AlgoMaster
            </h1>
            <p className="py-6 text-xl text-white/90 drop-shadow-lg">
              Master algorithms, connect with coders, and elevate your
              problem-solving abilities to new heights.
            </p>
            <motion.button
              className="btn btn-primary btn-lg text-lg px-8 py-3 shadow-2xl"
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

        {/* Enhanced Feature Cards */}
        <div className="flex items-center justify-center m-10 gap-6 flex-wrap">
          {[
            {
              icon: Code,
              title: "Code Problems",
              description:
                "Practice with hundreds of coding problems across different difficulty levels and topics",
              features: [
                "Multiple Languages",
                "Real-time Testing",
                "Judge0 Integration",
              ],
              color: "badge-primary",
              iconColor: "text-primary",
              borderColor: "border-primary/20",
            },
            {
              icon: Trophy,
              title: "Leaderboard",
              description:
                "Compete with other developers and track your progress with points and streaks",
              features: ["Global Rankings", "Points System", "Streak Tracking"],
              color: "badge-secondary",
              iconColor: "text-secondary",
              borderColor: "border-secondary/20",
            },
            {
              icon: Zap,
              title: "Sprint System",
              description:
                "Structured learning paths with curated problem collections and progress tracking",
              features: ["Learning Paths", "Progress Tracking", "Achievements"],
              color: "badge-accent",
              iconColor: "text-accent",
              borderColor: "border-accent/20",
            },
            {
              icon: BarChart3,
              title: "Advanced Analytics",
              description:
                "Comprehensive profile with detailed statistics, charts, and activity tracking",
              features: [
                "Activity Charts",
                "Progress Visualization",
                "Performance Insights",
              ],
              color: "badge-info",
              iconColor: "text-info",
              borderColor: "border-info/20",
            },
            {
              icon: Bot,
              title: "AI Chat Assistant",
              description:
                "Get intelligent hints and guidance from our AI coding mentor without spoiling solutions",
              features: ["Smart Hints", "Code Review", "Learning Support"],
              color: "badge-success",
              iconColor: "text-success",
              borderColor: "border-success/20",
            },
            {
              icon: User,
              title: "User Profiles",
              description:
                "Detailed user profiles with statistics, achievements, and comprehensive progress tracking",
              features: [
                "Detailed Stats",
                "Achievement System",
                "Activity Heatmap",
              ],
              color: "badge-warning",
              iconColor: "text-warning",
              borderColor: "border-warning/20",
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              className="group relative"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              {/* Hover Glow Effect */}
              <div
                className={`absolute -inset-0.5 bg-gradient-to-r ${feature.iconColor} opacity-0 group-hover:opacity-20 blur-lg transition-opacity duration-500 rounded-2xl`}
              />

              <motion.div
                className={`relative card bg-base-100 w-96 shadow-xl hover:shadow-2xl border-2 ${feature.borderColor} hover:border-opacity-60 transition-all duration-300 rounded-2xl overflow-hidden`}
                whileHover={{
                  y: -10,
                  transition: { duration: 0.3, ease: "easeOut" },
                }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Top Accent Line */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.iconColor} opacity-50 group-hover:opacity-100 transition-opacity duration-300`}
                />

                <div className="card-body p-8">
                  {/* Icon and Title Section */}
                  <div className="flex items-start gap-4 mb-4">
                    <motion.div
                      className={`p-3 rounded-xl bg-base-200 ${feature.iconColor} group-hover:scale-110 transition-transform duration-300`}
                      whileHover={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <feature.icon className="w-8 h-8" strokeWidth={2.5} />
                    </motion.div>

                    <div className="flex-1">
                      <h2 className="card-title text-2xl mb-2 group-hover:translate-x-1 transition-transform duration-300">
                        {feature.title}
                      </h2>
                      <div
                        className={`badge ${feature.color} badge-sm font-semibold`}
                      >
                        FEATURE
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-base-content/70 leading-relaxed mb-6 text-sm">
                    {feature.description}
                  </p>

                  {/* Features Tags */}
                  <div className="card-actions flex-wrap gap-2">
                    {feature.features.map((feat, idx) => (
                      <motion.div
                        key={idx}
                        className="badge badge-outline badge-md px-3 py-3 hover:badge-primary transition-colors duration-200 cursor-default"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        {feat}
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Bottom Decorative Element */}
                <div className="absolute bottom-0 right-0 w-32 h-32 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                  <feature.icon className="w-full h-full" strokeWidth={1} />
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Hero;
