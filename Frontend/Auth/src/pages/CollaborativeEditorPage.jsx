/**
 * Collaborative Code Editor Page
 * Real-time collaborative coding with Socket.IO
 */
import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { Editor } from "@monaco-editor/react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

const CollaborativeEditorPage = () => {
  const { user } = useSelector((state) => state.authSlice);
  const { roomId: urlRoomId } = useParams();
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [currentRoom, setCurrentRoom] = useState(null);
  const [code, setCode] = useState(
    "// Start coding together!\nconsole.log('Hello World!');"
  );
  const [language, setLanguage] = useState("javascript");
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const editorRef = useRef(null);

  const languages = [
    { id: "javascript", name: "JavaScript" },
    { id: "python", name: "Python" },
    { id: "java", name: "Java" },
    { id: "cpp", name: "C++" },
    { id: "c", name: "C" },
    { id: "typescript", name: "TypeScript" },
    { id: "html", name: "HTML" },
    { id: "css", name: "CSS" },
    { id: "json", name: "JSON" },
    { id: "xml", name: "XML" },
    { id: "sql", name: "SQL" },
    { id: "yaml", name: "YAML" },
  ];

  useEffect(() => {
    // Set room ID from URL if provided
    if (urlRoomId) {
      setRoomId(urlRoomId);
    }

    // Create socket connection - use environment variable or fallback to localhost
    const socketUrl = import.meta.env.VITE_API_URL
      ? import.meta.env.VITE_API_URL.replace("/api", "")
      : "http://localhost:5000";

    // For production debugging - hardcode production URL
    const isProduction = window.location.hostname !== "localhost";
    const finalSocketUrl = isProduction
      ? "https://devmtxh.xyz"
      : "https://devmtxh.xyz";

    console.log("Socket.IO connecting to:", finalSocketUrl);
    console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);
    console.log("Is production:", isProduction);

    const newSocket = io(finalSocketUrl, {
      transports: ["polling", "websocket"],
      timeout: 20000,
      withCredentials: true,
      forceNew: true,
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
    setSocket(newSocket);

    // Connection events
    newSocket.on("connect", () => {
      console.log("Connected to server:", newSocket.id);
      setConnected(true);
      addMessage("✅ Connected to server!");

      // Send user info to server
      if (user) {
        newSocket.emit("set-user-info", {
          username: `${user.firstName} ${user.lastName}`,
          userId: user._id,
        });
      } else {
        newSocket.emit("set-user-info", {
          username: "Anonymous User",
          userId: null,
        });
      }

      // Auto-join room if room ID is provided
      if (urlRoomId) {
        setTimeout(() => {
          newSocket.emit("join-room", { roomId: urlRoomId });
        }, 500);
      }
    });

    newSocket.on("disconnect", (reason) => {
      console.log("Disconnected from server:", reason);
      setConnected(false);
      addMessage(`❌ Disconnected from server: ${reason}`);
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      setConnected(false);
      addMessage(`❌ Connection error: ${error.message}`);
    });

    newSocket.on("reconnect", (attemptNumber) => {
      console.log("Reconnected after", attemptNumber, "attempts");
      setConnected(true);
      addMessage(`✅ Reconnected after ${attemptNumber} attempts`);
    });

    newSocket.on("reconnect_error", (error) => {
      console.error("Reconnection error:", error);
      addMessage(`❌ Reconnection failed: ${error.message}`);
    });

    // Room events
    newSocket.on("room-joined", (data) => {
      console.log("Room joined:", data);
      setCurrentRoom(data.roomId);
      addMessage(`✅ Joined room: ${data.roomId}`);

      // Set the complete user list when joining
      if (data.usersInRoom) {
        const otherUsers = data.usersInRoom
          .filter((user) => user.socketId !== newSocket.id) // Exclude current user
          .map((user) => ({
            id: user.socketId,
            name: user.username,
            userId: user.userId,
          }));
        setUsers(otherUsers);
      }
    });

    newSocket.on("user-joined", (data) => {
      addMessage(`👤 ${data.message}`);
      setUsers((prev) => [
        ...prev,
        {
          id: data.socketId,
          name: data.username || `User ${data.socketId.substring(0, 6)}`,
          userId: data.userId,
        },
      ]);
    });

    newSocket.on("user-left", (data) => {
      addMessage(`👋 ${data.message}`);
      setUsers((prev) => prev.filter((user) => user.id !== data.socketId));
    });

    // Code synchronization events
    newSocket.on("code-update", (data) => {
      if (data.from !== newSocket.id) {
        setCode(data.code);
        // Don't show code update messages in chat - they're too frequent
      }
    });

    newSocket.on("language-update", (data) => {
      if (data.from !== newSocket.id) {
        setLanguage(data.language);
        addMessage(
          `🌐 Language changed to ${data.language} by ${
            data.username || data.from.substring(0, 6)
          }`
        );
      }
    });

    // Message events
    newSocket.on("message", (data) => {
      if (data.from && data.from !== newSocket.id) {
        addMessage(
          `💬 ${data.username || data.from.substring(0, 6)}: ${data.message}`
        );
      }
    });

    // Cleanup
    return () => {
      newSocket.close();
    };
  }, [user, urlRoomId]);

  const addMessage = (msg) => {
    setMessages((prev) => [
      ...prev,
      { text: msg, timestamp: new Date().toLocaleTimeString() },
    ]);
  };

  const joinRoom = () => {
    if (socket && roomId.trim()) {
      socket.emit("join-room", { roomId: roomId.trim() });
    }
  };

  const leaveRoom = () => {
    if (socket && currentRoom) {
      socket.emit("leave-room", { roomId: currentRoom });
      setCurrentRoom(null);
      setUsers([]);
      addMessage(`Left room: ${currentRoom}`);
      // Navigate back to join room page
      navigate("/collaborate");
    }
  };

  const handleCodeChange = (value) => {
    setCode(value);

    // Broadcast code changes to other users in the room
    if (socket && currentRoom) {
      socket.emit("code-change", { roomId: currentRoom, code: value });
    }
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;

    // Configure editor options
    editor.updateOptions({
      fontSize: 14,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      wordWrap: "on",
      automaticLayout: true,
    });
  };

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);

    // Broadcast language changes to other users in the room
    if (socket && currentRoom) {
      socket.emit("language-change", {
        roomId: currentRoom,
        language: newLanguage,
      });
    }
  };

  const sendMessage = () => {
    if (socket && message.trim() && currentRoom) {
      socket.emit("message", message);
      addMessage(`You: ${message}`);
      setMessage("");
    }
  };

  const getFileExtension = (lang) => {
    const extensions = {
      javascript: "js",
      python: "py",
      java: "java",
      cpp: "cpp",
      c: "c",
      typescript: "ts",
      html: "html",
      css: "css",
      json: "json",
      xml: "xml",
      sql: "sql",
      yaml: "yml",
    };
    return extensions[lang] || "txt";
  };

  const downloadCode = () => {
    const extension = getFileExtension(language);
    const filename = `collaborative_code_${currentRoom}.${extension}`;
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addMessage("📥 Code downloaded!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-300 to-primary/10 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/5 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-base-100/80 backdrop-blur-xl shadow-2xl border-b border-white/10 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <button
              onClick={() => navigate("/collaborate")}
              className="btn btn-ghost btn-sm relative overflow-hidden group transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-base-content/20 active:scale-95"
              style={{
                background:
                  "linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))",
                boxShadow:
                  "0 4px 16px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <span className="relative z-10">← Back</span>
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center shadow-lg">
                <svg
                  className="w-6 h-6 text-white"
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
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Collaborative Code Editor
              </h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  connected ? "bg-green-400 animate-pulse" : "bg-red-400"
                }`}
              ></div>
              <span
                className={`badge ${
                  connected ? "badge-success" : "badge-error"
                } shadow-lg`}
              >
                {connected ? "Connected" : "Disconnected"}
              </span>
            </div>
            {currentRoom && (
              <div className="flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-lg border border-primary/20">
                <svg
                  className="w-4 h-4 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                <span className="text-sm font-semibold text-primary">
                  Room: {currentRoom}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-140px)]">
          {/* Room Controls */}
          <div className="lg:col-span-1">
            <div className="card bg-base-100/90 backdrop-blur-xl shadow-2xl border border-white/20 h-full relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-50"></div>
              <div className="card-body relative z-10">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <h2 className="card-title text-primary text-xl font-bold">
                    Room Controls
                  </h2>
                </div>

                {/* Room Join - Only show if not in a room */}
                {!currentRoom && (
                  <div className="space-y-4">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Enter Room ID"
                        className="input input-bordered flex-1"
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                        disabled={!connected}
                      />
                      <button
                        onClick={joinRoom}
                        className="btn btn-primary relative overflow-hidden group transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/50 active:scale-95"
                        style={{
                          background:
                            "linear-gradient(145deg, #3b82f6, #1d4ed8)",
                          boxShadow:
                            "0 8px 32px rgba(59, 130, 246, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                        }}
                        disabled={!connected || !roomId.trim()}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                        <span className="relative z-10">Join</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Room Status - Only show if in a room */}
                {currentRoom && (
                  <div className="space-y-4">
                    <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-medium text-primary">
                            Room: {currentRoom}
                          </span>
                          <p className="text-xs text-base-content/70 mt-1">
                            Share this room ID with others
                          </p>
                        </div>
                        <button
                          onClick={leaveRoom}
                          className="btn btn-error btn-sm relative overflow-hidden group transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-error/50 active:scale-95"
                          style={{
                            background:
                              "linear-gradient(145deg, #ef4444, #dc2626)",
                            boxShadow:
                              "0 6px 24px rgba(239, 68, 68, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                          }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                          <span className="relative z-10">Leave</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Language Selection */}
                <div>
                  <label className="label">
                    <span className="label-text">Language</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    value={language}
                    onChange={handleLanguageChange}
                    disabled={!currentRoom}
                  >
                    {languages.map((lang) => (
                      <option key={lang.id} value={lang.id}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Users in Room */}
                {currentRoom && (
                  <div>
                    <h3 className="font-semibold mb-2">
                      Users in Room ({users.length + 1})
                    </h3>
                    <div className="space-y-1">
                      <div className="text-sm bg-primary/20 p-2 rounded">
                        {user
                          ? `${user.firstName} ${user.lastName}`
                          : "Anonymous User"}{" "}
                        (You)
                      </div>
                      {users.map((user) => (
                        <div
                          key={user.id}
                          className="text-sm bg-base-200 p-2 rounded"
                        >
                          {user.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Download Code */}
                {currentRoom && (
                  <button
                    onClick={downloadCode}
                    className="btn btn-secondary w-full relative overflow-hidden group transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-secondary/50 active:scale-95"
                    style={{
                      background: "linear-gradient(145deg, #8b5cf6, #7c3aed)",
                      boxShadow:
                        "0 8px 32px rgba(139, 92, 246, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                    <span className="relative z-10">📥 Download Code</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Code Editor */}
          <div className="lg:col-span-2">
            <div className="card bg-base-100/90 backdrop-blur-xl shadow-2xl border border-white/20 h-full relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-accent/5 opacity-50"></div>
              <div className="card-body p-0 relative z-10">
                <div className="flex items-center justify-between p-6 border-b border-white/10 bg-gradient-to-r from-secondary/10 to-accent/10">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-secondary to-accent rounded-lg flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-white"
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
                    <h2 className="card-title text-secondary text-xl font-bold">
                      Code Editor
                    </h2>
                  </div>
                  <div className="flex items-center space-x-2 bg-base-200/50 px-3 py-1 rounded-lg border border-white/10">
                    <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold text-secondary">
                      {language.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="flex-1 relative" style={{ minHeight: "400px" }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-base-100 to-base-200 rounded-b-2xl">
                    <Editor
                      height="100%"
                      language={language}
                      value={code}
                      onChange={handleCodeChange}
                      onMount={handleEditorDidMount}
                      theme="vs-dark"
                      options={{
                        fontSize: 16,
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        wordWrap: "on",
                        automaticLayout: true,
                        readOnly: false,
                        placeholder: currentRoom
                          ? "Start coding together..."
                          : "Start coding... (Join a room to collaborate)",
                        fontLigatures: true,
                        cursorBlinking: "smooth",
                        cursorSmoothCaretAnimation: true,
                        smoothScrolling: true,
                        contextmenu: true,
                        mouseWheelZoom: true,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chat */}
          <div className="lg:col-span-1">
            <div className="card bg-base-100/90 backdrop-blur-xl shadow-2xl border border-white/20 h-full relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-primary/5 opacity-50"></div>
              <div className="card-body p-0 relative z-10">
                <div className="p-6 border-b border-white/10 bg-gradient-to-r from-accent/10 to-primary/10">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-accent to-primary rounded-lg flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                    </div>
                    <h2 className="card-title text-accent text-xl font-bold">
                      Chat
                    </h2>
                    <div className="ml-auto flex items-center space-x-2">
                      <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                      <span className="text-xs text-accent/70 font-medium">
                        Live
                      </span>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto max-h-64 bg-gradient-to-b from-base-100 to-base-200">
                  {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-base-content/50">
                      <div className="text-center">
                        <svg
                          className="w-12 h-12 mx-auto mb-2 opacity-50"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                        <p className="text-sm">
                          Start chatting with your team!
                        </p>
                      </div>
                    </div>
                  ) : (
                    messages.map((msg, index) => (
                      <div
                        key={index}
                        className="mb-3 p-3 bg-base-100/50 rounded-lg border border-white/10 shadow-sm"
                      >
                        <div className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-xs text-base-content/50 font-mono">
                                {msg.timestamp}
                              </span>
                            </div>
                            <p className="text-sm text-base-content break-words">
                              {msg.text}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-white/10 bg-gradient-to-r from-base-100 to-base-200">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      className="input input-bordered flex-1 bg-base-100/80 backdrop-blur-sm border-white/20 focus:border-accent/50 focus:ring-2 focus:ring-accent/20"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                      disabled={!currentRoom}
                    />
                    <button
                      onClick={sendMessage}
                      className="btn btn-primary relative overflow-hidden group transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/50 active:scale-95"
                      style={{
                        background: "linear-gradient(145deg, #3b82f6, #1d4ed8)",
                        boxShadow:
                          "0 6px 24px rgba(59, 130, 246, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                      }}
                      disabled={!currentRoom || !message.trim()}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                      <span className="relative z-10">Send</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollaborativeEditorPage;
