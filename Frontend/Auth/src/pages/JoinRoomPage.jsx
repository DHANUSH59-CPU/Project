/**
 * Join Room Page
 * Simple page to enter room ID and join collaborative coding
 */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Code, Zap, ArrowRight, Copy, RefreshCw } from "lucide-react";

const JoinRoomPage = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (!roomId.trim()) return;

    setLoading(true);
    // Navigate to collaborative editor with room ID
    navigate(`/collaborate/${roomId.trim().toUpperCase()}`);
  };

  const generateRoomId = () => {
    const randomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomId(randomId);
  };

  const copyRoomId = () => {
    if (roomId) {
      navigator.clipboard.writeText(roomId);
      // You could add a toast notification here
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-300 to-primary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-4">
            <Code className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-base-content mb-2">
            Join Collaborative Coding
          </h1>
          <p className="text-base-content/70">
            Enter a room ID to start coding together
          </p>
        </div>

        {/* Main Card */}
        <div className="card bg-base-100/80 backdrop-blur-sm shadow-2xl border border-white/20">
          <div className="card-body p-8">
            <form onSubmit={handleJoinRoom} className="space-y-6">
              {/* Room ID Input */}
              <div className="space-y-2">
                <label className="label">
                  <span className="label-text font-semibold">Room ID</span>
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Enter Room ID (e.g., ABC123)"
                    className="input input-bordered flex-1 text-center font-mono text-lg"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                    disabled={loading}
                    maxLength={10}
                  />
                  <button
                    type="button"
                    onClick={copyRoomId}
                    className="btn btn-ghost btn-square relative overflow-hidden group transform transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-base-content/20 active:scale-95"
                    style={{
                      background:
                        "linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))",
                      boxShadow:
                        "0 4px 16px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                    }}
                    disabled={!roomId}
                    title="Copy Room ID"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                    <Copy className="w-4 h-4 relative z-10" />
                  </button>
                </div>
              </div>

              {/* Join Button */}
              <button
                type="submit"
                className="btn btn-primary w-full text-lg h-12 relative overflow-hidden group transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/50 active:scale-95"
                style={{
                  background: "linear-gradient(145deg, #3b82f6, #1d4ed8)",
                  boxShadow:
                    "0 8px 32px rgba(59, 130, 246, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
                disabled={!roomId.trim() || loading}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                {loading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  <>
                    <ArrowRight className="w-5 h-5 mr-2 relative z-10" />
                    <span className="relative z-10">Join Room</span>
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="divider text-base-content/50">OR</div>

            {/* Generate Room ID */}
            <button
              onClick={generateRoomId}
              className="btn btn-secondary w-full text-lg h-12 relative overflow-hidden group transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-secondary/50 active:scale-95"
              style={{
                background: "linear-gradient(145deg, #8b5cf6, #7c3aed)",
                boxShadow:
                  "0 8px 32px rgba(139, 92, 246, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
              disabled={loading}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <RefreshCw className="w-5 h-5 mr-2 relative z-10" />
              <span className="relative z-10">Generate New Room ID</span>
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-1 gap-4">
          <div className="flex items-center space-x-3 p-4 bg-base-100/50 rounded-lg">
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-base-content">
                Real-time Collaboration
              </h3>
              <p className="text-sm text-base-content/70">
                Code together with multiple users
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-4 bg-base-100/50 rounded-lg">
            <div className="w-10 h-10 bg-secondary/20 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h3 className="font-semibold text-base-content">
                Live Code Sync
              </h3>
              <p className="text-sm text-base-content/70">
                See changes instantly across all users
              </p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 text-center">
          <p className="text-sm text-base-content/60">
            Share the Room ID with your friends to collaborate together!
          </p>
        </div>
      </div>
    </div>
  );
};

export default JoinRoomPage;
