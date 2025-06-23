const express = require("express");
const app = express();
const path = require("path");
const DB = require('mongoose');
const cookieParser = require('cookie-parser');
require('dotenv').config();
var cors = require('cors')



app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// // mongoDB connection
async function connectDB(){
  try{  
    await DB.connect(process.env.MONGO_URL)
    console.log("Database Connected");
  }
  catch(err){
    console.log("Database Connection err", err);
  }
}
connectDB()


// Routes
const authRoutes = require('./routes/authRoutes');
app.use('/', authRoutes);


app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
})



