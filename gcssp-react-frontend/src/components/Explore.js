import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Explore.css";

export default function Explore({ userEmail = "", onStartChat }) {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [followingSet, setFollowingSet] = useState(new Set());
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetchUsers();
    if (userEmail) fetchFollowing();
  }, [userEmail]);

  // ✅ Fetch all registered users
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/explore");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      setMsg("⚠️ Could not load users.");
    }
  };

  // ✅ Get following connections
  const fetchFollowing = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/connections/following/${userEmail}`
      );
      const ids = new Set(res.data.map((u) => u.id));
      setFollowingSet(ids);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Follow a user
  const handleFollow = async (id) => {
    if (!userEmail || userEmail.trim() === "") {
      setMsg("⚠️ Please login to follow people.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8080/api/connections/follow", {
        followerEmail: userEmail,
        followingId: id,
      });
      setMsg(res.data);
      fetchFollowing();
    } catch (err) {
      console.error(err);
      setMsg("❌ Failed to follow.");
    }
  };

  // ✅ Unfollow a user
  const handleUnfollow = async (id) => {
    if (!userEmail) {
      setMsg("⚠️ Please login.");
      return;
    }
    try {
      const res = await axios.post("http://localhost:8080/api/connections/unfollow", {
        followerEmail: userEmail,
        followingId: id,
      });
      setMsg(res.data);
      fetchFollowing();
    } catch (err) {
      console.error(err);
      setMsg("❌ Failed to unfollow.");
    }
  };

  // ✅ Search filter
  const filtered = users.filter((u) => {
    const q = query.toLowerCase();
    if (!q) return true;
    return (
      (u.name && u.name.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.interests && u.interests.toLowerCase().includes(q)) ||
      (u.programmingLanguages &&
        u.programmingLanguages.toLowerCase().includes(q))
    );
  });

  return (
    <div className="explore-page">
      <div className="explore-header">
        <h2>🌐 Explore People</h2>
        <div className="search-wrap">
          <input
            placeholder="Search by name, interest, or language..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="explore-list">
        {filtered.map((u) => (
          <div className="explore-card" key={u.id}>
            {/* 👤 Profile Avatar */}
            <div
              className="avatar"
              style={{
                backgroundImage: u.profileImage
                  ? `url(${u.profileImage})`
                  : "none",
              }}
            >
              {!u.profileImage && (
                <span>{u.name ? u.name.charAt(0).toUpperCase() : "?"}</span>
              )}
            </div>

            {/* 💡 User Info */}
            <div className="user-info">
              <div className="name">{u.name || u.email}</div>
              <div className="meta">{u.jobRole || u.interests || ""}</div>
              <div className="langs">{u.programmingLanguages || ""}</div>
            </div>

            {/* ⚙️ Action Buttons */}
            <div className="actions">
              {followingSet.has(u.id) ? (
                <button
                  className="btn btn-unfollow"
                  onClick={() => handleUnfollow(u.id)}
                >
                  Unfollow
                </button>
              ) : (
                <button
                  className="btn btn-follow"
                  onClick={() => handleFollow(u.id)}
                >
                  Connect
                </button>
              )}

              {/* 💬 Chat Button */}
              {u.email !== userEmail && (
                <button
                  className="btn btn-chat"
                  onClick={() => {
                    if (!userEmail) {
                      setMsg("⚠️ Please login to start chat.");
                      return;
                    }
                    if (onStartChat) onStartChat(u);
                  }}
                  style={{
                    background: "linear-gradient(135deg,#8b5cf6,#a78bfa)",
                    color: "#fff",
                    marginLeft: "10px",
                    border: "none",
                    borderRadius: "8px",
                    padding: "6px 12px",
                    cursor: "pointer",
                    fontWeight: 500,
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.boxShadow =
                      "0 0 12px rgba(139,92,246,0.7)")
                  }
                  onMouseLeave={(e) => (e.target.style.boxShadow = "none")}
                >
                  💬 Chat
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="explore-footer">
        <small>{msg}</small>
      </div>
    </div>
  );
}
