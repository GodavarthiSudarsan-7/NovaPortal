const express = require("express");
const http = require("http");
const cors = require("cors");
const axios = require("axios");
const { Server } = require("socket.io");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Create HTTP Server
const server = http.createServer(app);

// ✅ Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// ✅ Maintain mapping of email → socket.id
let users = {};

// ✅ Helper: Ensure user exists in Spring Boot
async function ensureUserExists(email) {
  try {
    const res = await axios.get(`http://localhost:8080/api/customers/${email}`);
    if (!res.data) {
      console.log(`⚠️ User not found, creating: ${email}`);
      await axios.post(`http://localhost:8080/api/customers`, { email });
    }
  } catch (err) {
    // If GET fails, try creating
    try {
      await axios.post(`http://localhost:8080/api/customers`, { email });
    } catch (e) {
      console.error("❌ Failed to ensure user exists:", e.message);
    }
  }
}

// ✅ On connection
io.on("connection", (socket) => {
  console.log(`⚡ User connected: ${socket.id}`);

  // 🔹 Register user
  socket.on("register", async (email) => {
    if (email && typeof email === "string") {
      users[email] = socket.id;
      await ensureUserExists(email);
      io.emit("usersOnline", Object.keys(users));
      console.log(`✅ Registered: ${email}`);
    }
  });

  // 🔹 Handle private messages
  socket.on("privateMessage", async ({ sender, receiver, message }) => {
    if (!sender || !receiver || !message) {
      console.warn("⚠️ Invalid message data:", { sender, receiver, message });
      return;
    }

    console.log(`📨 ${sender} → ${receiver}: ${message}`);

    // ✅ Make sure both users exist in backend
    await ensureUserExists(sender);
    await ensureUserExists(receiver);

    // ✅ Save message to backend (Spring Boot)
    try {
      await axios.post("http://localhost:8080/api/messages", {
        sender,
        recipient: receiver,
        message,
      });
      console.log("💾 Message saved successfully!");
    } catch (error) {
      console.error("❌ Failed to save message:", error.message);
    }

    // ✅ Send to receiver in real time if online
    const receiverSocket = users[receiver];
    if (receiverSocket) {
      io.to(receiverSocket).emit("receiveMessage", {
        sender,
        receiver,
        message,
        createdAt: new Date().toISOString(),
      });
    }

    // 🚫 Don't echo to sender (frontend already shows)
  });

  // 🔹 Typing notifications
  socket.on("typing", ({ sender, receiver }) => {
    const receiverSocket = users[receiver];
    if (receiverSocket) {
      io.to(receiverSocket).emit("typing", { sender });
    }
  });

  // 🔹 On disconnect
  socket.on("disconnect", () => {
    let disconnectedUser = null;
    for (const email in users) {
      if (users[email] === socket.id) {
        disconnectedUser = email;
        delete users[email];
        break;
      }
    }

    if (disconnectedUser)
      console.log(`❌ ${disconnectedUser} disconnected (${socket.id})`);
    io.emit("usersOnline", Object.keys(users));
  });
});

// ✅ Start server
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`🚀 Chat server running on port ${PORT}`);
});
