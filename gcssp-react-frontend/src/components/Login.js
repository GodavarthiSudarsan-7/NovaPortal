
import { useState } from "react";
import axios from "axios";
import "./Form.css";

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage("⚠️ Please enter both email and password.");
      return;
    }

    try {
      
      const response = await axios.post("http://localhost:8080/api/auth/login", {
        email,
        password,
      });

      console.log("🔐 Login API response:", response.data);

     
      if (response.data.success) {
        
        localStorage.setItem("email", response.data.email);
        localStorage.setItem("name", response.data.name);

        setMessage("✅ Login successful!");
        if (onLoginSuccess) onLoginSuccess(email);
      } else {
        setMessage(response.data.error || "❌ Invalid email or password.");
      }
    } catch (error) {
      console.error("❌ Login failed:", error);

      if (error.response?.data?.error) {
        setMessage(`⚠️ ${error.response.data.error}`);
      } else if (error.response?.data?.message) {
        setMessage(`⚠️ ${error.response.data.message}`);
      } else {
        setMessage("⚠️ Error connecting to backend.");
      }
    }
  };

  return (
    <div className="form-box">
      <h2>Login to NovaPortal</h2>
      <form onSubmit={handleLogin}>
        <div className="input-group">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="submit-btn">
          Login <span className="arrow">→</span>
        </button>
      </form>

      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default Login;
