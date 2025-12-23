import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Explore.css";

export default function Explore({ userEmail = "", onStartChat }) {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [followingSet, setFollowingSet] = useState(new Set());
  const [msg, setMsg] = useState("");
  const [selectedUser, setSelectedUser] = useState(null); // 👈 For popup details

  useEffect(() => {
    fetchUsers();
    if (userEmail) fetchFollowing();
  }, [userEmail]);

  
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/explore");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      setMsg("⚠️ Could not load users.");
    }
  };

 
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

 
  const filtered = users.filter((u) => {
    const q = query.toLowerCase();
    if (!q) return true;
    return (
      (u.name && u.name.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.interests && u.interests.toLowerCase().includes(q)) ||
      (u.jobRole && u.jobRole.toLowerCase().includes(q)) ||
      (u.college && u.college.toLowerCase().includes(q)) ||
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
            placeholder="Search by name, interest, job role, or college..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {/* 👥 User List */}
      <div className="explore-list">
        {filtered.map((u) => (
          <div
            className="explore-card"
            key={u.id}
            onClick={() => setSelectedUser(u)}
          >
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

            <div className="user-info">
              <div className="name">{u.name || u.email}</div>
              <div className="meta">{u.jobRole || u.interests || ""}</div>
              <div className="langs">{u.college || u.programmingLanguages || ""}</div>
            </div>

            <div className="actions">
              {followingSet.has(u.id) ? (
                <button
                  className="btn btn-unfollow"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUnfollow(u.id);
                  }}
                >
                  Unfollow
                </button>
              ) : (
                <button
                  className="btn btn-follow"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFollow(u.id);
                  }}
                >
                  Connect
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 🪄 Popup Modal for profile details */}
      {selectedUser && (
        <div className="popup-backdrop" onClick={() => setSelectedUser(null)}>
          <div className="popup-card" onClick={(e) => e.stopPropagation()}>
            <img
              src={
                selectedUser.profileImage ||
                "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              }
              alt="Profile"
              className="popup-avatar"
            />
            <h2>{selectedUser.name}</h2>
            <p><b>Job Role:</b> {selectedUser.jobRole || "Not specified"}</p>
            <p><b>College:</b> {selectedUser.college || "—"}</p>
            <p><b>Languages:</b> {selectedUser.programmingLanguages || "—"}</p>
            <p><b>Interests:</b> {selectedUser.interests || "—"}</p>
            <div className="links">
              {selectedUser.github && (
                <a href={selectedUser.github} target="_blank" rel="noreferrer">
                  🔗 GitHub
                </a>
              )}
              {selectedUser.linkedin && (
                <a href={selectedUser.linkedin} target="_blank" rel="noreferrer">
                  💼 LinkedIn
                </a>
              )}
            </div>
            <button
              onClick={() => {
                onStartChat(selectedUser);
                setSelectedUser(null);
              }}
              className="popup-chat-btn"
            >
              💬 Start Chat
            </button>
          </div>
        </div>
      )}

      <div className="explore-footer">
        <small>{msg}</small>
      </div>
    </div>
  );
}
