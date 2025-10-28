import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import "./AIDashboard.css";

export default function AIDashboard({ userEmail }) {
  const [summary, setSummary] = useState({});
  const [prompt, setPrompt] = useState("");
  const [aiResponse, setAIResponse] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const postsRes = await axios.get("http://localhost:8080/api/posts");
      const userPosts = postsRes.data.filter(
        (p) => p.customer?.email === userEmail
      );
      setSummary({
        totalPosts: userPosts.length,
        totalComments: userPosts.reduce(
          (sum, p) => sum + (p.comments?.length || 0),
          0
        ),
        joined: "2025",
      });
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const handleAskAI = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      // 🔥 Replace with your backend AI endpoint (later integrated)
      const fakeAI = `🤖 Nova AI: Based on your question "${prompt}", here’s a smart suggestion — Stay consistent and keep learning!`;
      setTimeout(() => {
        setAIResponse(fakeAI);
        setLoading(false);
      }, 1200);
    } catch (err) {
      console.error(err);
      setAIResponse("⚠️ AI Service unavailable right now.");
      setLoading(false);
    }
  };

  return (
    <div className="ai-dashboard">
      <motion.div
        className="dashboard-header"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2>🌌 Nova AI Dashboard</h2>
        <p>Get insights & chat with Nova Assistant</p>
      </motion.div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>📢 Posts</h3>
          <p>{summary.totalPosts || 0}</p>
        </div>
        <div className="stat-card">
          <h3>💬 Comments</h3>
          <p>{summary.totalComments || 0}</p>
        </div>
        <div className="stat-card">
          <h3>🕓 Joined</h3>
          <p>{summary.joined}</p>
        </div>
      </div>

      <div className="ai-chat">
        <textarea
          placeholder="Ask Nova anything..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button onClick={handleAskAI} disabled={loading}>
          {loading ? "Thinking..." : "Ask Nova 🚀"}
        </button>
      </div>

      {aiResponse && (
        <motion.div
          className="ai-response"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {aiResponse}
        </motion.div>
      )}
    </div>
  );
}
