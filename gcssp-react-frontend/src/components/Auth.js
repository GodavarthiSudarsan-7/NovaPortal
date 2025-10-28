import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import "./Auth.css";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const res = await axios.post("http://localhost:8080/api/login", {
          email: formData.email,
          password: formData.password,
        });
        setMessage("✅ " + res.data);
        navigate("/dashboard");
      } else {
        const res = await axios.post("http://localhost:8080/api/register", formData);
        setMessage("🎉 " + res.data);
        setIsLogin(true);
      }
    } catch (err) {
      setMessage("❌ " + (err.response?.data || "Something went wrong!"));
    }
  };

  return (
    <div className="auth-container">
      <motion.div
        className="auth-box"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h2>{isLogin ? "🚀 Login" : "🌌 Register"}</h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="👤 Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="📧 Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="🔑 Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="glow-btn">
            {isLogin ? "Login 🚀" : "Register 🌟"}
          </button>
        </form>
        {message && <p className="msg">{message}</p>}
        <p>
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Register here" : "Login here"}
          </span>
        </p>
      </motion.div>
    </div>
  );
};

export default Auth;
