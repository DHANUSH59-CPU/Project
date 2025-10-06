import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Editor from "@monaco-editor/react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const socket = io("https://algomaster-backend.onrender.com", {
  withCredentials: true,
  transports: ["websocket"], // ensure faster connection
});

const GroupCoding = () => {
  const { user } = useSelector((state) => state.authSlice);
  const { roomId: urlRoomId } = useParams();

  const [roomId, setRoomId] = useState(urlRoomId || "");
  const [joined, setJoined] = useState(false);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [users, setUsers] = useState([]);
  const [typingUser, setTypingUser] = useState(null);
  const typingTimeout = useRef(null);

  useEffect(() => {
    if (!joined || !user?.firstName) return;

    socket.emit("join", { roomId, userName: user.firstName });

    const handleUserJoined = (userList) => setUsers(userList);
    const handleCodeUpdate = (incomingCode) => setCode(incomingCode);
    const handleLanguageUpdate = (lang) => setLanguage(lang);
    const handleUserTyping = (name) => {
      if (name !== user.firstName) {
        setTypingUser(name);
        clearTimeout(typingTimeout.current);
        typingTimeout.current = setTimeout(() => setTypingUser(null), 2000);
      }
    };

    socket.on("userJoined", handleUserJoined);
    socket.on("codeUpdate", handleCodeUpdate);
    socket.on("languageUpdate", handleLanguageUpdate);
    socket.on("userTyping", handleUserTyping);

    return () => {
      socket.emit("leaveRoom");
      socket.off("userJoined", handleUserJoined);
      socket.off("codeUpdate", handleCodeUpdate);
      socket.off("languageUpdate", handleLanguageUpdate);
      socket.off("userTyping", handleUserTyping);
    };
  }, [joined, roomId, user?.firstName]);

  const handleCodeChange = (newValue) => {
    setCode(newValue);
    socket.emit("codeChange", { roomId, code: newValue });
    socket.emit("typing", { roomId, userName: user.firstName });
  };

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    socket.emit("languageChange", { roomId, language: newLang });
  };

  const handleJoin = () => {
    if (!roomId.trim()) return alert("Enter Room ID");
    if (!user?.firstName) return alert("Please log in first");
    setJoined(true);
  };

  const handleLeave = () => {
    socket.emit("leaveRoom");
    setJoined(false);
    setUsers([]);
    setCode("");
    setTypingUser(null);
  };

  return (
    <div className="min-h-screen w-full bg-base-200">
      <div className="w-full min-h-screen bg-opacity-80 backdrop-blur-sm flex items-center justify-center p-4">
        {!joined ? (
          <div className="max-w-md w-full mx-auto bg-base-100 border border-base-300 p-8 rounded-xl shadow-2xl backdrop-blur-sm">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4 bg-primary/20">
                <svg
                  className="w-8 h-8 text-primary"
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
              <h2 className="text-2xl font-bold text-base-content mb-1">
                Join Coding Room
              </h2>
              <p className="text-base-content/70">
                Collaborate with others in real-time
              </p>
            </div>
            <input
              type="text"
              placeholder="Enter Room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="w-full px-4 py-3 mb-6 outline-none focus:ring-0 focus:outline-none bg-base-200 border border-base-300 text-base-content rounded-lg focus:ring-primary focus:border-transparent transition-all"
            />
            <button
              onClick={handleJoin}
              className="w-full bg-primary hover:bg-primary/90 text-primary-content px-4 py-3 rounded-lg font-medium transition-colors shadow-lg hover:shadow-primary/20 flex items-center justify-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              Join Room
            </button>
          </div>
        ) : (
          <div className="max-w-7xl w-full mx-auto bg-base-100 border border-base-300 p-6 rounded-xl shadow-2xl backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
              <div>
                <h2 className="text-xl font-bold text-base-content">
                  Room:{" "}
                  <span className="text-primary break-all font-mono">
                    {roomId}
                  </span>
                </h2>
                <p className="text-sm text-base-content/70 mt-1">
                  You:{" "}
                  <span className="text-success font-medium">
                    {user?.firstName}
                  </span>
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="relative">
                  <select
                    value={language}
                    onChange={handleLanguageChange}
                    className="appearance-none bg-base-200 border border-base-300 text-base-content pl-4 pr-10 py-2 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="cpp">C++</option>
                    <option value="java">Java</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg
                      className="h-5 w-5 text-base-content/60"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
                <button
                  onClick={handleLeave}
                  className="bg-error hover:bg-error/90 text-error-content px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Leave
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3 border border-base-300 rounded-lg overflow-hidden bg-base-200/50">
                <Editor
                  height="520px"
                  defaultLanguage={language}
                  language={language}
                  value={code}
                  theme="vs-dark"
                  onChange={handleCodeChange}
                  options={{
                    fontSize: 14,
                    minimap: { enabled: false },
                    fontFamily: "monospace",
                    scrollBeyondLastLine: false,
                  }}
                />
                {typingUser && (
                  <div className="p-3 text-sm text-base-content/70 italic bg-base-200 border-t border-base-300 flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    {typingUser} is typing...
                  </div>
                )}
              </div>

              <div className="bg-base-200/50 border border-base-300 rounded-lg p-5 h-[520px] overflow-hidden">
                <h3 className="text-lg font-semibold text-base-content mb-4 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-success"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  Online Users ({users.length})
                </h3>
                <ul className="space-y-3 overflow-y-auto h-[90%] pr-2">
                  {users.length > 0 ? (
                    users.map((u, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-3 p-2 bg-base-300/30 rounded-lg hover:bg-base-300/50 transition-colors"
                      >
                        <div className="relative">
                          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-primary-content">
                            {u.charAt(0).toUpperCase()}
                          </div>
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-success border-2 border-base-100 rounded-full"></span>
                        </div>
                        <span className="font-medium text-base-content">
                          {u}
                        </span>
                      </li>
                    ))
                  ) : (
                    <li className="text-base-content/50 italic p-2">
                      No users online
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupCoding;
