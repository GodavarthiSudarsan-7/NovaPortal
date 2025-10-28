
import React from "react";

import "./Welcome.css";

function Welcome({ onLoginClick }) {
  return (
    <div className="welcome-fullscreen">
      <nav className="welcome-navbar">
        <div className="logo-text">NovaPortal</div>
        <button className="nav-login-btn" onClick={onLoginClick}>
          Login →
        </button>
      </nav>

      <div className="nova-full-animation">
        <div className="nova-orb-large">
          <div className="orb-core-large"></div>
          <div className="orb-ring-large"></div>
          <div className="orb-pulse"></div>
        </div>
        <h1 className="welcome-title-large">Welcome to NovaPortal</h1>
        <p className="welcome-subtitle-large">
          Experience the future of intelligent access and connectivity.
        </p>
      </div>
    </div>
  );
}

export default Welcome;
