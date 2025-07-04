// const mongoose = require('mongoose')

// const UserSchema = new mongoose.Schema({
//     username:String,
//     email:String,
//     password:String,
//     verificationcode:String
//     // createdAt:Date
// },{timestamps : true})
// module.exports = mongoose.model("Users", UserSchema)
    

import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  verificationcode: String
}, { timestamps: true });

const Users = mongoose.model("Users", UserSchema);
export default Users;
