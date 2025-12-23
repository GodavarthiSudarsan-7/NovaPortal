import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Linkedin, Github, FileText, Trash2, ImageOff } from "lucide-react";

const Profile = ({ email, onLogout }) => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    jobRole: "",
    programmingLanguages: "",
    interests: "",
    bio: "",
    profileImage: "",
    college: "",
    degree: "",
    skills: "",
    linkedin: "",
    github: "",
    resume: "",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    if (email) fetchProfile();
  }, [email]);

  
  const fetchProfile = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/users/${encodeURIComponent(email)}`);
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

 
  const handleDeleteImage = async () => {
    const confirmDelete = window.confirm("🖼️ Are you sure you want to remove your profile picture?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:8080/api/users/${encodeURIComponent(email)}/image`);
      alert("🖼️ Profile image removed successfully!");
      fetchProfile();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to delete profile image.");
    }
  };

 
  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, resume: reader.result });
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please upload a PDF file only!");
    }
  };


  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:8080/api/users/${encodeURIComponent(email)}`, profile);
      setMessage("✅ Profile updated successfully!");
      fetchProfile();
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to update profile!");
    }
  };


  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "⚠️ Are you sure you want to permanently delete your account?\nThis action cannot be undone!"
    );
    if (!confirmDelete) return;

    try {
      const res = await axios.delete(`http://localhost:8080/api/users/${encodeURIComponent(email)}`);
      alert("🗑️ Account deleted successfully!");
      if (onLogout) onLogout();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to delete account. Try again.");
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
              position: "relative",
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

            {/* 🔗 Social Links */}
            <div style={{ display: "flex", gap: "15px", marginTop: "10px" }}>
              {profile.linkedin && (
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#0A66C2",
                    background: "rgba(10, 102, 194, 0.1)",
                    borderRadius: "50%",
                    padding: "8px",
                  }}
                >
                  <Linkedin size={20} />
                </a>
              )}
              {profile.github && (
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#fff",
                    background: "rgba(255,255,255,0.1)",
                    borderRadius: "50%",
                    padding: "8px",
                  }}
                >
                  <Github size={20} />
                </a>
              )}
              {profile.resume && (
                <a
                  href={profile.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#a78bfa",
                    background: "rgba(167,139,250,0.15)",
                    borderRadius: "50%",
                    padding: "8px",
                  }}
                >
                  <FileText size={20} />
                </a>
              )}
            </div>

            {/* 📸 Change / Delete Photo */}
            <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
              <label
                style={{
                  background: "linear-gradient(135deg,#8b5cf6,#a78bfa)",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: "14px",
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

              {profile.profileImage && (
                <button
                  onClick={handleDeleteImage}
                  style={{
                    background: "linear-gradient(135deg,#f43f5e,#b91c1c)",
                    border: "none",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    color: "#fff",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <ImageOff size={16} /> Remove
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div style={{ display: "grid", gap: "20px" }}>
          {[
            { label: "Name", name: "name", placeholder: "Enter full name" },
            { label: "College / University", name: "college", placeholder: "e.g., SRM University, IIT Madras" },
            { label: "Degree / Branch", name: "degree", placeholder: "e.g., B.Tech CSE, MCA, M.Tech AI" },
            { label: "Job Role / Aspiration", name: "jobRole", placeholder: "e.g., Full Stack Developer, AI Engineer" },
            { label: "Programming Languages", name: "programmingLanguages", placeholder: "e.g., Python, Java, React" },
            { label: "Skills", name: "skills", placeholder: "e.g., Machine Learning, React, SQL" },
            { label: "Interests", name: "interests", placeholder: "e.g., Cloud, AI, Cybersecurity" },
            { label: "LinkedIn", name: "linkedin", placeholder: "Paste your LinkedIn profile link" },
            { label: "GitHub", name: "github", placeholder: "Paste your GitHub link" },
          ].map((field, i) => (
            <div className="input-group" key={i}>
              <label>{field.label}</label>
              <input
                name={field.name}
                value={profile[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
              />
            </div>
          ))}

          <div className="input-group">
            <label>Resume (PDF)</label>
            <input type="file" accept="application/pdf" onChange={handleResumeUpload} />
            {profile.resume && (
              <a
                href={profile.resume}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  marginTop: "8px",
                  color: "#a78bfa",
                  display: "inline-block",
                  textDecoration: "underline",
                }}
              >
                View Uploaded Resume
              </a>
            )}
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

        {/* Buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "30px",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          <motion.button
            onClick={handleSave}
            whileHover={{ scale: 1.05 }}
            style={{
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

          <motion.button
            onClick={handleDeleteAccount}
            whileHover={{ scale: 1.05 }}
            style={{
              padding: "12px 24px",
              background: "linear-gradient(135deg,#ef4444,#b91c1c)",
              border: "none",
              borderRadius: "10px",
              color: "#fff",
              fontWeight: 600,
              fontSize: "16px",
              cursor: "pointer",
              boxShadow: "0 0 10px rgba(239,68,68,0.6)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Trash2 size={18} /> Delete Account
          </motion.button>
        </div>

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
