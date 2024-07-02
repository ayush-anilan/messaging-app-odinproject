const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const auth = require("./middleware/auth");
const http = require("http").Server(app);
require("dotenv").config();

const corsOptions = {
  origin: "http://localhost:5173", // frontend URI
  credentials: true,
};

app.use(express.json());
app.use(cors(corsOptions));

// Connect to MongoDb
connectDB();

// Routes
app.use("/api/auth", authRoutes);

const socketIO = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:5173",
  },
});

socketIO.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  //Listens and logs the message to the console
  socket.on("message", (data) => {
    console.log(data);
  });

  socket.on("disconnect", () => {
    console.log("🔥: A user disconnected");
  });
});

// Protected route example
app.get("/api/protected", auth, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});

app.get("/", (req, res) => {
  res.status(201).json({ message: "Connected to Backend!" });
});

const PORT = process.env.PORT || 8000;

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
