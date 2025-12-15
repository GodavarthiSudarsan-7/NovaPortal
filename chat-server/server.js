const express = require("express");
const http = require("http");
const cors = require("cors");
const axios = require("axios");
const { Server } = require("socket.io");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});


let users = {};


async function fetchUserDetails(email) {
  try {
    const res = await axios.get(`http://localhost:8080/api/users/${email}`);
    return res.data || {};
  } catch (err) {
    console.warn(`⚠️ Could not fetch profile for ${email}`);
    return {};
  }
}

io.on("connection", (socket) => {
  console.log(`⚡ User connected: ${socket.id}`);


  socket.on("register", async (email) => {
    if (email && typeof email === "string") {
      users[email.toLowerCase()] = socket.id;
      console.log(`✅ Registered: ${email}`);
      io.emit("usersOnline", Object.keys(users));
    }
  });


  socket.on("privateMessage", async ({ sender, receiver, message }) => {
    if (!sender || !receiver || !message) {
      console.warn("⚠️ Invalid message data:", { sender, receiver, message });
      return;
    }

    sender = sender.toLowerCase();
    receiver = receiver.toLowerCase();

    console.log(`📨 ${sender} → ${receiver}: ${message}`);

  
    try {
      await axios.post("http://localhost:8080/api/messages", {
        sender,
        receiver,
        message,
      });
      console.log("💾 Message saved successfully!");
    } catch (error) {
      console.error("❌ Failed to save message:", error.message);
    }

 
    const senderInfo = await fetchUserDetails(sender);
    const payload = {
      sender,
      receiver,
      message,
      senderName: senderInfo?.name || sender.split("@")[0],
      senderImage:
        senderInfo?.profileImage ||
        "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
      createdAt: new Date().toISOString(),
    };

  
    const receiverSocket = users[receiver];
    if (receiverSocket) {
      io.to(receiverSocket).emit("receiveMessage", payload);

   
      io.to(receiverSocket).emit("newChatNotification", {
        from: payload.senderName,
        email: sender,
        message:
          message.length > 50 ? message.slice(0, 50) + "..." : message,
        image: payload.senderImage,
      });
    }
  });

 
  socket.on("typing", ({ sender, receiver }) => {
    if (!sender || !receiver) return;
    const receiverSocket = users[receiver.toLowerCase()];
    if (receiverSocket) {
      io.to(receiverSocket).emit("typing", { sender });
    }
  });

  
  socket.on("disconnect", () => {
    const userEmail = Object.keys(users).find((key) => users[key] === socket.id);
    if (userEmail) {
      delete users[userEmail];
      console.log(`❌ ${userEmail} disconnected`);
    } else {
      console.log(`❌ Unknown user disconnected: ${socket.id}`);
    }
    io.emit("usersOnline", Object.keys(users));
  });
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`🚀 Chat server running on port ${PORT}`);
});
