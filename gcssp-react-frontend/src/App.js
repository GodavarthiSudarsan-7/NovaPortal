import React, { useState } from "react";
import Welcome from "./components/Welcome";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import Explore from "./components/Explore"; // 👈 Added new page
import "./App.css";
import "./components/LoginPage.css";

function App() {
  const [page, setPage] = useState("welcome"); // welcome | login | dashboard | explore
  const [formType, setFormType] = useState("login"); // login | register
  const [userEmail, setUserEmail] = useState("");
  const [slide, setSlide] = useState(false);

  const handleLoginSuccess = (email) => {
    setUserEmail(email);
    setPage("dashboard");
  };

  const handleLogout = () => {
    setPage("welcome");
    setFormType("login");
    setUserEmail("");
  };

  const handleLoginClick = () => {
    setSlide(true);
    setTimeout(() => {
      setPage("login");
      setSlide(false);
      setFormType("login");
    }, 700);
  };

  // ✅ Page Routing Logic
  if (page === "dashboard") {
    return <Dashboard email={userEmail} onLogout={handleLogout} onExploreClick={() => setPage("explore")} />;
  }

  if (page === "explore") {
    return (
      <div className="page-wrapper">
        <Explore userEmail={userEmail} />
        <div className="footer-nav">
          <button className="back-btn" onClick={() => setPage("dashboard")}>
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (page === "welcome") {
    return (
      <div className={`page-wrapper ${slide ? "slide-out-left" : ""}`}>
        <Welcome onLoginClick={handleLoginClick} />
      </div>
    );
  }

  // ✅ Login / Register Page
  return (
    <div className="page-wrapper slide-in-right">
      <div className="login-page">
        {/* Orb Background */}
        <div className="orb-background">
          <div className="small-orb"></div>
          <div className="orb-ring"></div>
          <div className="orb-glow"></div>
        </div>

        {/* Top Navigation Buttons */}
        <div className="top-bar">
          <button
            className={`top-btn ${formType === "login" ? "active-btn" : ""}`}
            onClick={() => setFormType("login")}
          >
            Login
          </button>
          <button
            className={`top-btn ${formType === "register" ? "active-btn" : ""}`}
            onClick={() => setFormType("register")}
          >
            Register
          </button>
          <button className="top-btn back-btn" onClick={() => setPage("welcome")}>
            ← Back
          </button>
        </div>

        {/* Main Form Section */}
        <div className="form-section">
          <h1 className="login-heading">Welcome to NovaPortal</h1>
          <div key={formType} className="form-card form-switch">
            {formType === "login" ? (
              <Login onLoginSuccess={handleLoginSuccess} />
            ) : (
              <Register />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
