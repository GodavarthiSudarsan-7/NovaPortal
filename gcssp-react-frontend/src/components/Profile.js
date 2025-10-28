import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const Profile = ({ email }) => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    jobRole: "",
    programmingLanguages: "",
    interests: "",
    bio: "",
    profileImage: "",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    if (email) fetchProfile();
  }, [email]);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/users/${email}`);
      setProfile(res.data || {});
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, profileImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:8080/api/users/${email}`, profile);
      setMessage("✅ Profile updated successfully!");
      fetchProfile();
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to update profile!");
    }
  };

  return (
    <motion.div
      className="profile-page"
      style={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px",
        boxSizing: "border-box",
        background: "radial-gradient(circle at top left, #1e1b4b, #0f172a)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        style={{
          width: "90%",
          maxWidth: "900px",
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(12px)",
          borderRadius: "20px",
          boxShadow: "0 0 25px rgba(255,255,255,0.15)",
          padding: "40px",
          color: "#fff",
          overflowY: "auto",
          maxHeight: "90vh",
        }}
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Profile Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "25px",
            marginBottom: "30px",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              overflow: "hidden",
              border: "3px solid rgba(167,139,250,0.6)",
              boxShadow: "0 0 15px rgba(167,139,250,0.5)",
            }}
          >
            <img
              src={
                profile.profileImage ||
                "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              }
              alt="Profile"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>

          <div>
            <h2 style={{ fontSize: "28px", marginBottom: "5px" }}>
              {profile.name || "Your Name"}
            </h2>
            <p style={{ opacity: 0.8 }}>{profile.email}</p>
            <label
              style={{
                background: "linear-gradient(135deg,#8b5cf6,#a78bfa)",
                padding: "8px 12px",
                borderRadius: "8px",
                color: "#fff",
                cursor: "pointer",
                fontSize: "14px",
                display: "inline-block",
                marginTop: "10px",
              }}
            >
              Change Photo
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </label>
          </div>
        </div>

        {/* Profile Form */}
        <div style={{ display: "grid", gap: "20px" }}>
          <div className="input-group">
            <label>Name</label>
            <input
              name="name"
              value={profile.name}
              onChange={handleChange}
              placeholder="Enter full name"
            />
          </div>

          <div className="input-group">
            <label>Job Role</label>
            <input
              name="jobRole"
              value={profile.jobRole}
              onChange={handleChange}
              placeholder="e.g., Full Stack Developer"
            />
          </div>

          <div className="input-group">
            <label>Programming Languages</label>
            <input
              name="programmingLanguages"
              value={profile.programmingLanguages}
              onChange={handleChange}
              placeholder="e.g., Java, React, Python"
            />
          </div>

          <div className="input-group">
            <label>Interests</label>
            <input
              name="interests"
              value={profile.interests}
              onChange={handleChange}
              placeholder="e.g., AI, Cloud, Cybersecurity"
            />
          </div>

          <div className="input-group">
            <label>Bio</label>
            <textarea
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              placeholder="Write a short description about yourself..."
              rows="3"
            />
          </div>
        </div>

        <motion.button
          onClick={handleSave}
          whileHover={{ scale: 1.05 }}
          style={{
            marginTop: "25px",
            padding: "12px 24px",
            background: "linear-gradient(135deg,#8b5cf6,#a78bfa)",
            border: "none",
            borderRadius: "10px",
            color: "#fff",
            fontWeight: 600,
            fontSize: "16px",
            cursor: "pointer",
            boxShadow: "0 0 10px rgba(139,92,246,0.6)",
          }}
        >
          Save Changes
        </motion.button>

        {message && (
          <p
            style={{
              marginTop: "15px",
              color: message.includes("✅") ? "#22c55e" : "#ef4444",
              fontWeight: 500,
            }}
          >
            {message}
          </p>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Profile;
