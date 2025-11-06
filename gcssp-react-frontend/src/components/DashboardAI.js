import React, { useState } from "react";
import axios from "axios";
import "./DashboardAI.css";

export default function DashboardAI({ userEmail, onLogout }) {
  const [chat, setChat] = useState([]);
  const [input, setInput] = useState("");
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { who: "you", text: input };
    setChat((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // ✅ Call backend API
      const res = await axios.get(
        `http://localhost:8080/api/ai/insights?keyword=${encodeURIComponent(
          input
        )}`
      );

      const reply = {
        who: "nova",
        text: `🧠 Nova AI found insights for "${input}" — ${res.data.relatedUsers.length} related users found.`,
      };
      setChat((prev) => [...prev, reply]);
      setInsights(res.data);
    } catch (err) {
      console.error("⚠️ AI Insights fetch failed:", err);
      const reply = {
        who: "nova",
        text: `❌ Sorry, I couldn't find any insights for "${input}". Try another topic!`,
      };
      setChat((prev) => [...prev, reply]);
      setInsights(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-ai">
      {/* 💬 Left Panel - Chat */}
      <div className="left-panel">
        <div className="ai-orb">🤖</div>
        <h3>Nova Assistant</h3>

        <div className="chat-box">
          {chat.map((msg, i) => (
            <div
              key={i}
              className={`chat-line ${msg.who === "nova" ? "nova" : "you"}`}
            >
              {msg.text}
            </div>
          ))}
          {loading && (
            <div className="chat-line nova">💭 Nova is thinking...</div>
          )}
        </div>

        <form className="chat-input" onSubmit={sendMessage}>
          <input
            type="text"
            placeholder="Ask Nova anything (e.g. 'Python', 'Machine Learning', 'AI')"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit">Ask Nova 🚀</button>
        </form>

        <button className="logout" onClick={onLogout}>
          Logout
        </button>
      </div>

      {/* 📊 Right Panel - Insights */}
      <div className="right-panel">
        <h3>🔍 AI Insights & Recommendations</h3>

        {!insights ? (
          <div className="empty">
            Start by asking Nova about a topic or skill...
          </div>
        ) : (
          <div className="insights-container">
            {/* Suggested Communities */}
            <div className="insight-section">
              <h4>💡 Suggested Communities</h4>
              {insights.suggestedCommunities?.length ? (
                <ul>
                  {insights.suggestedCommunities.map((c, i) => (
                    <li key={i}>🌐 {c}</li>
                  ))}
                </ul>
              ) : (
                <p>— None found —</p>
              )}
            </div>

            {/* Related Technologies */}
            <div className="insight-section">
              <h4>⚙️ Related Technologies</h4>
              {insights.relatedTechnologies?.length ? (
                <ul>
                  {insights.relatedTechnologies.map((t, i) => (
                    <li key={i}>💻 {t}</li>
                  ))}
                </ul>
              ) : (
                <p>— No technologies found —</p>
              )}
            </div>

            {/* Related Users */}
            <div className="insight-section">
              <h4>👥 People with Similar Interests</h4>
              {insights.relatedUsers?.length > 0 ? (
                <div className="rec-list">
                  {insights.relatedUsers.map((u) => (
                    <div
                      key={u.id}
                      className="rec-card clickable"
                      onClick={() => {
                        // 🧭 Go to Chat Page directly
                        window.location.href = `/chat?user=${encodeURIComponent(
                          u.email
                        )}`;
                      }}
                    >
                      <div
                        className="rec-avatar"
                        style={{
                          backgroundImage: u.profileImage
                            ? `url(${u.profileImage})`
                            : "none",
                        }}
                      >
                        {!u.profileImage && (
                          <span>
                            {u.name ? u.name.charAt(0).toUpperCase() : "?"}
                          </span>
                        )}
                      </div>
                      <div className="rec-info">
                        <div className="rec-name">{u.name || u.email}</div>
                        <div className="rec-meta">{u.interests}</div>
                        <div className="rec-langs">
                          {u.programmingLanguages}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No matching people found.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
