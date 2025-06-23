// const express = require("express");
// const app = express();
// const path = require("path");
// const DB = require('mongoose');
// const cookieParser = require('cookie-parser');
// require('dotenv').config();
// var cors = require('cors')

// app.use(express.json());
// // app.use(cors({
// //   origin: 'http://localhost:3000', 
// //   credentials: true 
// // }));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

// // // mongoDB connection
// async function connectDB(){
//   try{  
//     await DB.connect(process.env.MONGO_URL)
//     console.log("Database Connected");
//   }
//   catch(err){
//     console.log("Database Connection err", err);
//   }
// }
// connectDB()


// // Routes
// const authRoutes = require('./routes/authRoutes');
// app.use('/', authRoutes);


// const server = app.listen(process.env.PORT, () => {
//   console.log(`Server running on port ${process.env.PORT}`);
// })

// const io = require('socket.io')(server, {
//   pingTimeout: 60000,
//   cors : {
//     origin: 'http://localhost:3000',
//   },
// })

// io.on("connection",(socket) =>{
//   console.log("Connected");
  
// })



const express = require("express");
const http = require("http");
const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);

// === MIDDLEWARE ===
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// === MONGODB CONNECTION ===
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ Database connected");
  } catch (err) {
    console.error("❌ Database connection error:", err);
  }
}
connectDB();

// === ROUTES ===
const authRoutes = require('./routes/authRoutes'); // your auth routes
app.use('/', authRoutes);

// === SOCKET.IO SETUP ===
const { Server } = require("socket.io");

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: 'http://localhost:3000',
    credentials: true
  }
});

// === SOCKET.IO EVENTS ===
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // Receive message from client
  socket.on("send_message", async (data) => {
    console.log("Message received:", data);

    // Broadcast message to all clients
    io.emit("receive_message", data);

    // Save message to MongoDB
    const Message = require('./models/message');
    const newMsg = new Message(data);
    await newMsg.save();
  });
  
  // Disconnect
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// === START SERVER ===
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


