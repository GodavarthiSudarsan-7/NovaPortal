
import React, { useState } from "react";
import axios from "axios";
import "../components/LoginPage.css"; 

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    
    if (password !== confirmPassword) {
      setMessage("⚠️ Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/api/customers/register", {
        name,
        email,
        password,
      });

      if (response.status === 200 || response.status === 201) {
        setMessage("✅ Registration successful! You can now login.");
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      } else {
        setMessage("⚠️ Registration failed. Try again.");
      }
    } catch (error) {
      console.error(error);
      if (error.response) {
        setMessage(error.response.data?.message || "Server error occurred.");
      } else {
        setMessage("Error connecting to backend.");
      }
    }
  };

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      {/* ✨ Glass Box Container */}
      <div
        className="form-card register-form"
        style={{
          width: "360px",
          background: "rgba(255, 255, 255, 0.1)",
          padding: "30px",
          borderRadius: "15px",
          boxShadow: "0 0 25px rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(10px)",
          animation: "fadeInUp 0.8s ease-in-out",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            fontSize: "28px",
            fontWeight: "700",
            letterSpacing: "1px",
            marginBottom: "25px",
            textShadow: "0 0 15px rgba(255,255,255,0.5)",
          }}
        >
          Create Account
        </h2>

        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={inputStyle}
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />

          <input
            type="password"
            placeholder="Create Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={inputStyle}
          />

          <button
            type="submit"
            style={{
              width: "100%",
              background:
                "linear-gradient(135deg, rgba(147,112,219,1), rgba(184,184,255,0.9))",
              color: "white",
              border: "none",
              padding: "12px",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "16px",
              marginTop: "15px",
              letterSpacing: "0.5px",
              boxShadow: "0 0 10px rgba(147,112,219,0.6)",
              transition: "0.3s ease",
            }}
            onMouseEnter={(e) =>
              (e.target.style.boxShadow = "0 0 20px rgba(147,112,219,1)")
            }
            onMouseLeave={(e) =>
              (e.target.style.boxShadow = "0 0 10px rgba(147,112,219,0.6)")
            }
          >
            Register
          </button>
        </form>

        {message && (
          <p
            style={{
              marginTop: "15px",
              textAlign: "center",
              fontSize: "14px",
              color:
                message.includes("⚠️") || message.includes("not match")
                  ? "#ff5c5c"
                  : "#fff",
              textShadow: "0 0 10px rgba(255,255,255,0.3)",
            }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  margin: "10px 0",
  borderRadius: "10px",
  border: "none",
  background: "rgba(255, 255, 255, 0.15)",
  color: "#fff",
  fontSize: "15px",
  outline: "none",
  transition: "0.3s",
  caretColor: "#fff",
};

export default Register;
