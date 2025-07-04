// const express = require("express");
// const http = require("http");
// const path = require("path");
// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// const cookieParser = require("cookie-parser");
// const cors = require("cors");


// dotenv.config();

// const app = express();
// const server = http.createServer(app);


// // app.use(cors({
// //   origin: 'https://chatter-boxx-ten.vercel.app',
// //   credentials: true
// // }));

// const allowedOrigins = [
//   'http://localhost:3000',
//   'https://chatter-boxx-ten.vercel.app'
// ];

// // Update Express CORS middleware
// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true
// }));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

// // === MONGODB CONNECTION ===
// async function connectDB() {
//   try {
//     await mongoose.connect(process.env.MONGO_URL);
//     console.log("Database connected");
//   } catch (err) {
//     console.error("Database connection error:", err);
//   }
// }
// connectDB();


// const authRoutes = require('./routes/authRoutes'); 
// app.use('/', authRoutes);


// const { Server } = require("socket.io");

// // const io = new Server(server, {
// //   pingTimeout: 60000,
// //   cors: {
// //     credentials: true
// //   }
// // });

// const io = new Server(server, {
//   pingTimeout: 60000,
//   cors: {
//     origin: allowedOrigins,
//     credentials: true
//   }
// });

// // === SOCKET.IO EVENTS ===
// io.on("connection", (socket) => {
//   console.log("New client connected:", socket.id);

//   // Receive message from client
//   socket.on("send_message", async (data) => {
//     console.log("Message received:", data);

//     // Broadcast message to all clients
//     io.emit("receive_message", data);

//     // Save message to MongoDB
//     const Message = require('./models/message');
//     const newMsg = new Message(data);
//     await newMsg.save();
//   });
  
//   // Disconnect
//   socket.on("disconnect", () => {
//     console.log("Client disconnected:", socket.id);
//   });
// });

// // === START SERVER ===

// if(process.env.NODE_ENV !== "production"){
//   const PORT = process.env.PORT || 4000;
//   server.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
//   });
// }

// module.exports = server;


import express from "express";
import http from "http";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { Server } from "socket.io";

import authRoutes from "./routes/authRoutes.js";
import Message from "./models/message.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

// Resolve __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// CORS setup
const allowedOrigins = [
  'http://localhost:3000',
  'https://chatterboxx-backend.onrender.com'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// MongoDB connection
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Database connected");
  } catch (err) {
    console.error("Database connection error:", err);
  }
}
connectDB();

// Routes
app.use("/", authRoutes);

// Socket.IO setup
const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: allowedOrigins,
    credentials: true
  }
});

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("send_message", async (data) => {
    console.log("Message received:", data);
    io.emit("receive_message", data);

    const newMsg = new Message(data);
    await newMsg.save();
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
