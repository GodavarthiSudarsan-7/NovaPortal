// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css"; // global styles
import App from "./App"; // main App component

// Create root and render App
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
