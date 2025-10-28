import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import Picker from "emoji-picker-react";
import "./ChatPage.css";

const socket = io("http://localhost:5000", { autoConnect: true });

export default function ChatPage({ userEmail, selectedUser }) {
  const [connections, setConnections] = useState([]);
  const [activeChat, setActiveChat] = useState(selectedUser || null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // ✅ Register user in socket
  useEffect(() => {
    if (userEmail) socket.emit("register", userEmail.toLowerCase());
  }, [userEmail]);

  // ✅ Fetch all connections
  useEffect(() => {
    if (userEmail) {
      axios
        .get(`http://localhost:8080/api/connections/following/${userEmail}`)
        .then((res) => setConnections(res.data))
        .catch((err) => console.error("⚠️ Error loading connections:", err));
    }
  }, [userEmail]);

  // ✅ Fetch previous messages from backend
  const fetchMessages = async (receiverEmail) => {
    if (!receiverEmail) return;
    try {
      const senderLower = userEmail.toLowerCase();
      const receiverLower = receiverEmail.toLowerCase();

      console.log("🔍 Fetching chat:", senderLower, receiverLower);
      const res = await axios.get(
        `http://localhost:8080/api/messages/${senderLower}/${receiverLower}`
      );
      console.log("✅ Messages fetched:", res.data);
      setMessages(res.data || []);
    } catch (err) {
      console.error("⚠️ Error fetching messages:", err);
    }
  };

  // ✅ Auto-open chat when selected user changes
  useEffect(() => {
    if (selectedUser) {
      setActiveChat(selectedUser);
      fetchMessages(selectedUser.email);
    }
  }, [selectedUser]);

  // ✅ Re-fetch when switching between users or after refresh
  useEffect(() => {
    if (activeChat && userEmail) {
      fetchMessages(activeChat.email);
    }
  }, [activeChat, userEmail]);

  // ✅ Handle real-time receiving of messages
  useEffect(() => {
    const handleReceive = (msg) => {
      if (
        msg.sender === activeChat?.email ||
        msg.receiver === activeChat?.email
      ) {
        setMessages((prev) => {
          const alreadyExists = prev.some(
            (m) =>
              (m.sender?.email || m.sender) === msg.sender &&
              (m.receiver?.email || m.receiver) === msg.receiver &&
              (m.content || m.message) === (msg.content || msg.message)
          );
          return alreadyExists ? prev : [...prev, msg];
        });
      }
    };

    const handleTyping = (data) => {
      if (data.sender === activeChat?.email) {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 1500);
      }
    };

    socket.on("receiveMessage", handleReceive);
    socket.on("typing", handleTyping);

    return () => {
      socket.off("receiveMessage", handleReceive);
      socket.off("typing", handleTyping);
    };
  }, [activeChat]);

  // ✅ Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ Send message
  const handleSend = async () => {
    if (!newMessage.trim() || !activeChat) return;

    const messageData = {
      sender: userEmail.toLowerCase(),
      receiver: activeChat.email.toLowerCase(),
      message: newMessage.trim(),
      createdAt: new Date().toISOString(),
    };

    // Show immediately in UI
    setMessages((prev) => [...prev, messageData]);
    setNewMessage("");
    setShowEmoji(false);

    // Emit via socket
    socket.emit("privateMessage", messageData);

    // Save to backend
    try {
      await axios.post("http://localhost:8080/api/messages", messageData);
      console.log("💾 Message saved to DB");
    } catch (err) {
      console.error("⚠️ Error saving message:", err);
    }
  };

  // ✅ Handle typing event
  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    if (activeChat)
      socket.emit("typing", {
        sender: userEmail.toLowerCase(),
        receiver: activeChat.email.toLowerCase(),
      });
  };

  // ✅ Emoji picker
  const onEmojiClick = (emojiData) => {
    setNewMessage((prev) => prev + emojiData.emoji);
  };

  return (
    <div className="chat-container">
      {/* 🧍 Left Sidebar */}
      <div className="chat-sidebar">
        <h3 className="sidebar-title">💬 Your Connections</h3>
        {connections.length === 0 ? (
          <p className="no-connections">No connections yet!</p>
        ) : (
          connections.map((u) => (
            <div
              key={u.id}
              className={`chat-user-card ${
                activeChat?.email === u.email ? "active" : ""
              }`}
              onClick={() => {
                setActiveChat(u);
                fetchMessages(u.email);
              }}
            >
              <div className="avatar">
                {u.profileImage ? (
                  <img src={u.profileImage} alt="profile" />
                ) : (
                  <span>{u.name ? u.name.charAt(0).toUpperCase() : "?"}</span>
                )}
              </div>
              <div>
                <h4>{u.name}</h4>
                <p className="user-email">{u.email}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 💬 Chat Main Area */}
      <div className="chat-main">
        {!activeChat ? (
          <div className="chat-empty">
            <h2>No conversations yet</h2>
            <p>Select a person to start chatting 💬</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="chat-header">
              <div className="chat-user">
                <div className="avatar">
                  {activeChat.profileImage ? (
                    <img src={activeChat.profileImage} alt="profile" />
                  ) : (
                    <span>
                      {activeChat.name
                        ? activeChat.name.charAt(0).toUpperCase()
                        : "?"}
                    </span>
                  )}
                </div>
                <div>
                  <h3>{activeChat.name}</h3>
                  <p className="chat-status">🟢 Online</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="chat-body">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`message-row ${
                    (msg.sender?.email || msg.sender) === userEmail
                      ? "sent-row"
                      : "received-row"
                  }`}
                >
                  <div
                    className={`message-bubble ${
                      (msg.sender?.email || msg.sender) === userEmail
                        ? "sent"
                        : "received"
                    }`}
                  >
                    {msg.content || msg.message}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="typing-indicator">
                  💭 {activeChat.name} is typing...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Section */}
            <div className="chat-input-area">
              {showEmoji && (
                <div className="emoji-picker">
                  <Picker onEmojiClick={onEmojiClick} />
                </div>
              )}
              <button
                className="emoji-btn"
                onClick={() => setShowEmoji((prev) => !prev)}
              >
                😄
              </button>
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={handleTyping}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button className="send-btn" onClick={handleSend}>
                ✈️
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
