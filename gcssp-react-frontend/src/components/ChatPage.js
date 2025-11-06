import React, { useEffect, useState, useRef, useCallback } from "react";
import io from "socket.io-client";
import axios from "axios";
import Picker from "emoji-picker-react";
import toast, { Toaster } from "react-hot-toast";
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

  // ✅ Register user on socket
  useEffect(() => {
    if (userEmail) {
      socket.emit("register", userEmail.toLowerCase());
    }
  }, [userEmail]);

  // ✅ Load connections
  useEffect(() => {
    if (userEmail) {
      axios
        .get(`http://localhost:8080/api/connections/following/${userEmail}`)
        .then((res) => setConnections(res.data))
        .catch((err) => console.error("⚠️ Error loading connections:", err));
    }
  }, [userEmail]);

  // ✅ Fetch chat history (memoized)
  const fetchMessages = useCallback(
    async (receiverEmail) => {
      if (!receiverEmail) return;
      try {
        const res = await axios.get(
          `http://localhost:8080/api/messages/${userEmail.toLowerCase()}/${receiverEmail.toLowerCase()}`
        );
        setMessages(res.data || []); // reset to only fetched messages
      } catch (err) {
        console.error("⚠️ Error fetching messages:", err);
      }
    },
    [userEmail]
  );

  // ✅ Handle switching between chats — clear old messages first
  useEffect(() => {
    if (selectedUser) {
      setActiveChat(selectedUser);
      setMessages([]); // 🧹 clear old chat before loading new one
      fetchMessages(selectedUser.email);
    }
  }, [selectedUser, fetchMessages]);

  // ✅ Refresh when switching activeChat
  useEffect(() => {
    if (activeChat && userEmail) {
      setMessages([]); // 🧹 clear previous messages instantly
      fetchMessages(activeChat.email);
    }
  }, [activeChat, userEmail, fetchMessages]);

  // ✅ Real-time message handling (no duplicates)
  useEffect(() => {
    const handleReceive = (msg) => {
      const isCurrentChat =
        msg.sender === activeChat?.email ||
        msg.receiver === activeChat?.email;

      if (!isCurrentChat) return;

      setMessages((prev) => {
        const isDuplicate = prev.some(
          (m) =>
            (m.sender?.email || m.sender) === msg.sender &&
            (m.receiver?.email || m.receiver) === msg.receiver &&
            (m.content || m.message)?.trim() ===
              (msg.content || msg.message)?.trim()
        );
        return isDuplicate ? prev : [...prev, msg];
      });
    };

    const handleTyping = (data) => {
      if (data.sender === activeChat?.email) {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 1500);
      }
    };

    socket.off("receiveMessage").on("receiveMessage", handleReceive);
    socket.off("typing").on("typing", handleTyping);
    socket.off("newChatNotification").on("newChatNotification", (data) => {
      toast(`${data.from}: ${data.message}`, {
        icon: "📩",
        style: {
          background: "#1e1b4b",
          color: "#fff",
          borderRadius: "10px",
          padding: "10px",
        },
        duration: 4000,
      });
    });

    return () => {
      socket.off("receiveMessage", handleReceive);
      socket.off("typing", handleTyping);
      socket.off("newChatNotification");
    };
  }, [activeChat]);

  // ✅ Auto-scroll to bottom on message update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ Send message
  const handleSend = async () => {
    if (!newMessage.trim() || !activeChat) return;

    const msgData = {
      sender: userEmail.toLowerCase(),
      receiver: activeChat.email.toLowerCase(),
      message: newMessage.trim(),
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, msgData]);
    setNewMessage("");
    setShowEmoji(false);

    socket.emit("privateMessage", msgData);
  };

  // ✅ Typing indicator
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
      <Toaster position="top-right" />

      {/* Sidebar */}
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
                setMessages([]); // clear instantly
                fetchMessages(u.email);
              }}
            >
              <div className="avatar">
                {u.profileImage ? (
                  <img
                    src={u.profileImage}
                    alt="profile"
                    style={{
                      width: "45px",
                      height: "45px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
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

      {/* Chat area */}
      <div className="chat-main">
        {!activeChat ? (
          <div className="chat-empty">
            <h2>No conversations yet</h2>
            <p>Select a person to start chatting 💬</p>
          </div>
        ) : (
          <>
            <div className="chat-header">
              <div className="chat-user">
                <div className="avatar">
                  {activeChat.profileImage ? (
                    <img
                      src={activeChat.profileImage}
                      alt="profile"
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
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

            <div className="chat-body">
              {messages.map((msg, i) => (
                <div
                  key={i}
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

            <div className="chat-input-area">
              {showEmoji && (
                <div className="emoji-picker">
                  <Picker onEmojiClick={onEmojiClick} />
                </div>
              )}
              <button
                className="emoji-btn"
                onClick={() => setShowEmoji((p) => !p)}
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
