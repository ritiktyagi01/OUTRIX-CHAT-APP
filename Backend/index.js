const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const chat = require("./models/chatmodel");
const userRoutes = require("./Routes/userRoutes");
const chatRoutes = require("./Routes/chatRoutes");
const messageRoutes = require("./Routes/messageRoutes");
const cors = require("cors");

dotenv.config(); // Load environment variables

mongoose
  .connect("mongodb://localhost:27017/CHAT", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Connected to MongoDB");
  })
  .catch((error) => {
    console.error("❌ Error connecting to MongoDB:", error);
  });

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000", // React frontend URL
    credentials: true, // Allow sending cookies/auth headers
  })
);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on PORT ${PORT}...`);
});

// ✅ Setup Socket.IO
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("⚡ Client connected");

  // ✅ Setup user in socket
  socket.on("setup", (userdata) => {
    socket.join(userdata);
    console.log(`👤 User ${userdata} connected`);
    socket.emit("connected");
  });

  // ✅ Join a chat room
  socket.on("join room", (room) => {
    socket.join(room);
    console.log(`🏠 User joined room ${room}`);
  });

  // ✅ Handle new messages and send them in real-time
  socket.on("new message", (newMessage) => {
    console.log(`new message ${newMessage}`);
    
    const chat = newMessage.chat.users;
    console.log("chat",chat);
    
    if (!chat) return console.error("Chat users not found!");

    chat.forEach((user) => {
      if (user !== newMessage.sender._id) {
        socket.to(user._id).emit("message received", newMessage);
      }
    });
  });

  // ✅ Handle disconnection
  socket.on("disconnect", () => {
    console.log("❌ Client disconnected");
  });
});
