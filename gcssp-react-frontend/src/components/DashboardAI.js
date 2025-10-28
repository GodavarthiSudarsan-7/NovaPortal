import React, { useEffect, useState } from "react";
import axios from "axios";
import "./DashboardAI.css";

export default function DashboardAI({ userEmail, onLogout }) {
  const [recs, setRecs] = useState([]);
  const [chat, setChat] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (userEmail) fetchRecommendations();
  }, [userEmail]);

  const fetchRecommendations = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/recommendations?email=${encodeURIComponent(userEmail)}`);
      setRecs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    // local simulated AI reply (placeholder)
    const userMsg = { who: "you", text: input };
    setChat(prev => [...prev, userMsg]);
    setInput("");

    setTimeout(() => {
      const reply = { who: "nova", text: `Nova says: I heard you mention "${userMsg.text}". Try connecting with people interested in ${userMsg.text.split(" ")[0] || "learning"}!` };
      setChat(prev => [...prev, reply]);
    }, 900);
  };

  return (
    <div className="dashboard-ai">
      <div className="left-panel">
        <div className="ai-orb">Nova</div>
        <h3>Nova Assistant</h3>
        <div className="chat-box">
          {chat.map((c, idx) => (
            <div key={idx} className={`chat-line ${c.who === "nova" ? "nova" : "you"}`}>
              {c.text}
            </div>
          ))}
        </div>
        <form className="chat-input" onSubmit={sendMessage}>
          <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Ask Nova for help (e.g. 'Find AI people')" />
          <button type="submit">Send</button>
        </form>
        <button className="logout" onClick={onLogout}>Logout</button>
      </div>

      <div className="right-panel">
        <h3>Recommended people</h3>
        <div className="rec-list">
          {recs.length === 0 && <div className="empty">No recommendations yet</div>}
          {recs.map(r => (
            <div key={r.id} className="rec-card">
              <div className="rec-avatar" style={{backgroundImage: r.profileImage ? `url(${r.profileImage})` : "none"}}>
                {!r.profileImage && <span>{r.name ? r.name.charAt(0).toUpperCase() : "?"}</span>}
              </div>
              <div className="rec-info">
                <div className="rec-name">{r.name || r.email}</div>
                <div className="rec-meta">{r.interests}</div>
                <div className="rec-langs">{r.programmingLanguages}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
