// const mongoose = require('mongoose');

// const messageSchema = new mongoose.Schema({
//   sender: {
//     type: String,
//     required: true,
//   },
//   message: {
//     type: String,
//     required: true,
//   },
//   time: {
//     type: Date,
//     default: Date.now,
//   }
// });

// module.exports = mongoose.model('Message', messageSchema);


import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    default: Date.now,
  }
});

const Message = mongoose.model('Message', messageSchema);
export default Message;
