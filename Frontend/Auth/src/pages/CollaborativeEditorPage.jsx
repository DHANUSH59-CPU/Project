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

  const backendURL = "https://algomaster-backend.onrender.com";

  /* -------------------- SOCKET CONNECTION -------------------- */
  useEffect(() => {
    const newSocket = io(backendURL, {
      transports: ["websocket"], // ✅ force WebSocket
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
    });
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("✅ Connected to server:", newSocket.id);
      setConnected(true);
      addMessage("✅ Connected to server!");

      // Send user info
      newSocket.emit("set-user-info", {
        username: user
          ? `${user.firstName} ${user.lastName}`
          : "Anonymous User",
        userId: user ? user._id : null,
      });

      // Auto-join if URL roomId exists
      if (urlRoomId) {
        setTimeout(
          () => newSocket.emit("join-room", { roomId: urlRoomId }),
          300
        );
      }
    });

    newSocket.on("disconnect", (reason) => {
      console.log("❌ Disconnected:", reason);
      setConnected(false);
      addMessage(`❌ Disconnected: ${reason}`);
    });

    newSocket.on("connect_error", (err) => {
      console.error("Socket error:", err.message);
      setConnected(false);
    });

    // ✅ Room join confirmation
    newSocket.on("room-joined", (data) => {
      setCurrentRoom(data.roomId);
      addMessage(`✅ Joined room: ${data.roomId}`);
    });

    // ✅ When someone joins/leaves
    newSocket.on("user-joined", (data) => {
      addMessage(`👤 ${data.message}`);
      setUsers((prev) => [...prev, data]);
    });

    newSocket.on("user-left", (data) => {
      addMessage(`👋 ${data.message}`);
      setUsers((prev) => prev.filter((u) => u.socketId !== data.socketId));
    });

    // ✅ Listen for code updates
    newSocket.on("code-update", (data) => {
      if (data.from !== newSocket.id) {
        console.log("✏️ Code update received:", data);
        setCode(data.code);
      }
    });

    // ✅ Listen for language updates
    newSocket.on("language-update", (data) => {
      if (data.from !== newSocket.id) {
        setLanguage(data.language);
        addMessage(
          `🌐 Language changed to ${data.language} by ${data.username}`
        );
      }
    });

    // ✅ Listen for chat messages
    newSocket.on("message", (data) => {
      if (data.from !== newSocket.id) {
        addMessage(`💬 ${data.username}: ${data.message}`);
      }
    });

    return () => newSocket.disconnect();
  }, [user, urlRoomId]);

  /* -------------------- HELPERS -------------------- */
  const addMessage = (msg) =>
    setMessages((prev) => [
      ...prev,
      { text: msg, time: new Date().toLocaleTimeString() },
    ]);

  const handleCodeChange = (value) => {
    setCode(value);
    if (socket && currentRoom) {
      socket.emit("code-change", { roomId: currentRoom, code: value });
    }
  };

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    if (socket && currentRoom)
      socket.emit("language-change", {
        roomId: currentRoom,
        language: newLang,
      });
  };

  const joinRoom = () => {
    if (socket && roomId.trim())
      socket.emit("join-room", { roomId: roomId.trim() });
  };

  const leaveRoom = () => {
    if (socket && currentRoom) {
      socket.emit("leave-room", { roomId: currentRoom });
      setCurrentRoom(null);
      setUsers([]);
    }
  };

  const sendMessage = () => {
    if (socket && message.trim() && currentRoom) {
      socket.emit("message", message);
      addMessage(`You: ${message}`);
      setMessage("");
    }
  };

  /* -------------------- RENDER -------------------- */
  return (
    <div className="p-6 min-h-screen bg-base-200">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Collaborative Code Editor</h1>
        <div className="flex gap-2 items-center">
          <span
            className={`w-3 h-3 rounded-full ${
              connected ? "bg-green-500" : "bg-red-500"
            }`}
          ></span>
          {currentRoom && <span>Room: {currentRoom}</span>}
        </div>
      </div>

      {!currentRoom && (
        <div className="flex mb-4 gap-2">
          <input
            type="text"
            placeholder="Enter room ID"
            className="input input-bordered flex-1"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <button
            className="btn btn-primary"
            onClick={joinRoom}
            disabled={!connected}
          >
            Join
          </button>
        </div>
      )}

      {currentRoom && (
        <div className="mb-4 flex justify-between">
          <div>
            <label className="mr-2 font-semibold">Language:</label>
            <select
              value={language}
              onChange={handleLanguageChange}
              className="select select-bordered"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="cpp">C++</option>
              <option value="java">Java</option>
            </select>
          </div>
          <button className="btn btn-error" onClick={leaveRoom}>
            Leave Room
          </button>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 bg-base-100 rounded-lg overflow-hidden shadow-lg">
          <Editor
            height="70vh"
            language={language}
            value={code}
            onChange={handleCodeChange}
            theme="vs-dark"
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              automaticLayout: true,
            }}
          />
        </div>

        <div className="bg-base-100 p-4 rounded-lg shadow-lg flex flex-col">
          <h2 className="font-semibold mb-2">Chat</h2>
          <div className="flex-1 overflow-y-auto mb-2 bg-base-200 p-2 rounded">
            {messages.map((m, i) => (
              <p key={i} className="text-sm">
                {m.time} - {m.text}
              </p>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Type..."
              className="input input-sm flex-1"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button className="btn btn-sm btn-primary" onClick={sendMessage}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollaborativeEditorPage;
