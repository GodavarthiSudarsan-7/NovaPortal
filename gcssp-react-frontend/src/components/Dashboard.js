import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Home,
  Users,
  LogOut,
  MessageSquare,
  Brain,
  MessageCircle,
  Globe,
  Compass,
} from "lucide-react"; 
import CommunityFeed from "./CommunityFeed";
import Explore from "./Explore";
import Profile from "./Profile";
import AIDashboard from "./AIDashboard";
import ChatPage from "./ChatPage";
import Resources from "./Resources";
import AICareerMentor from "./AICareerMentor"; 
import axios from "axios";

const Dashboard = ({ email, onLogout }) => {
  const [activePage, setActivePage] = useState("home");
  const [user, setUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  
  useEffect(() => {
    if (email) {
      axios
        .get(`http://localhost:8080/api/users/${email}`)
        .then((res) => setUser(res.data))
        .catch((err) => console.error("Error loading user:", err));
    }
  }, [email]);

  
  const handleStartChat = (otherUser) => {
    setSelectedUser(otherUser);
    setActivePage("chat");
  };

 
  const renderPage = () => {
    const contentStyle = {
      width: "100%",
      height: "100%",
      overflowY: "auto",
      padding: "40px",
      boxSizing: "border-box",
    };

    switch (activePage) {
      case "profile":
        return (
          <div style={contentStyle}>
            <Profile email={email} />
          </div>
        );

      case "feed":
        return (
          <div style={contentStyle}>
            <CommunityFeed userEmail={email} />
          </div>
        );

      case "explore":
        return (
          <div style={contentStyle}>
            <Explore userEmail={email} onStartChat={handleStartChat} />
          </div>
        );

      case "ai":
        return (
          <div style={contentStyle}>
            <AIDashboard userEmail={email} />
          </div>
        );

      case "mentor":
        return (
          <div style={contentStyle}>
            <AICareerMentor />
          </div>
        );

      case "chat":
        return (
          <div style={contentStyle}>
            <ChatPage userEmail={email} selectedUser={selectedUser} />
          </div>
        );

      case "resources":
        return (
          <div style={contentStyle}>
            <Resources />
          </div>
        );

      default:
        return (
          <motion.div
            style={{
              ...contentStyle,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                borderRadius: "20px",
                padding: "40px",
                width: "80%",
                maxWidth: "800px",
                textAlign: "center",
                backdropFilter: "blur(12px)",
                boxShadow: "0 0 20px rgba(167,139,250,0.3)",
              }}
            >
              <motion.h1
                style={{
                  fontSize: "36px",
                  color: "#a78bfa",
                  marginBottom: "20px",
                }}
              >
                👋 Welcome back, {user?.name || "User"}!
              </motion.h1>

              <p style={{ opacity: 0.85, marginBottom: "30px" }}>
                Here’s your NovaPortal summary:
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "20px",
                }}
              >
                <div className="info-card">
                  <h3>💼 Role</h3>
                  <p>{user?.jobRole || "Not specified"}</p>
                </div>

                <div className="info-card">
                  <h3>🧠 Languages</h3>
                  <p>{user?.programmingLanguages || "No data"}</p>
                </div>

                <div className="info-card">
                  <h3>🌐 Interests</h3>
                  <p>{user?.interests || "—"}</p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setActivePage("feed")}
                style={{
                  marginTop: "35px",
                  background: "linear-gradient(135deg,#8b5cf6,#a78bfa)",
                  border: "none",
                  color: "#fff",
                  fontSize: "16px",
                  padding: "12px 24px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  boxShadow: "0 0 15px rgba(139,92,246,0.5)",
                }}
              >
                Go to Feed →
              </motion.button>
            </motion.div>
          </motion.div>
        );
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        background: "radial-gradient(circle at top left, #1e1b4b, #0f172a)",
        color: "white",
        overflow: "hidden",
      }}
    >
      {/* Sidebar */}
      <motion.div
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          width: "250px",
          background: "rgba(255,255,255,0.04)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "20px 10px",
          boxShadow: "2px 0 10px rgba(0,0,0,0.4)",
        }}
      >
        <div>
          <motion.h2
            style={{
              textAlign: "center",
              color: "#a78bfa",
              fontSize: "22px",
              letterSpacing: "1px",
              marginBottom: "40px",
            }}
          >
            ⚡ NovaPortal
          </motion.h2>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <button
              onClick={() => setActivePage("home")}
              className={`sidebar-btn ${activePage === "home" ? "active" : ""}`}
            >
              <Home size={22} /> <span>Home</span>
            </button>

            <button
              onClick={() => setActivePage("profile")}
              className={`sidebar-btn ${
                activePage === "profile" ? "active" : ""
              }`}
            >
              <User size={22} /> <span>Profile</span>
            </button>

            <button
              onClick={() => setActivePage("feed")}
              className={`sidebar-btn ${activePage === "feed" ? "active" : ""}`}
            >
              <MessageSquare size={22} /> <span>Feed</span>
            </button>

            <button
              onClick={() => setActivePage("explore")}
              className={`sidebar-btn ${
                activePage === "explore" ? "active" : ""
              }`}
            >
              <Users size={22} /> <span>Explore</span>
            </button>

            <button
              onClick={() => setActivePage("ai")}
              className={`sidebar-btn ${activePage === "ai" ? "active" : ""}`}
            >
              <Brain size={22} /> <span>AI Dashboard</span>
            </button>

            <button
              onClick={() => setActivePage("mentor")}
              className={`sidebar-btn ${activePage === "mentor" ? "active" : ""}`}
            >
              <Compass size={22} /> <span>Career Mentor</span>
            </button>

            <button
              onClick={() => setActivePage("chat")}
              className={`sidebar-btn ${activePage === "chat" ? "active" : ""}`}
            >
              <MessageCircle size={22} /> <span>Chat</span>
            </button>

            <button
              onClick={() => setActivePage("resources")}
              className={`sidebar-btn ${
                activePage === "resources" ? "active" : ""
              }`}
            >
              <Globe size={22} /> <span>Resources</span>
            </button>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="sidebar-btn logout-btn"
          style={{
            background: "linear-gradient(135deg,#f43f5e,#ef4444)",
            border: "none",
            color: "#fff",
            fontWeight: 600,
            padding: "10px 14px",
            borderRadius: "8px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            marginTop: "40px",
          }}
        >
          <LogOut size={20} /> Logout
        </button>
      </motion.div>

      {/* Main Content */}
      <motion.div
        key={activePage}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        style={{
          flex: 1,
          height: "100%",
          width: "100%",
          overflow: "hidden",
        }}
      >
        <AnimatePresence mode="wait">{renderPage()}</AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Dashboard;
