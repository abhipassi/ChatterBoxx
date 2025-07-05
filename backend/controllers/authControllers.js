// const jwt = require('jsonwebtoken')
// const bcrypt = require('bcryptjs')
// const userModel = require('../models/users');
// const Message = require('../models/message');
// const { sendVerificationCode } = require('../middleware/email');



// exports.registerUser = async (req, res) => {
//   try {
//     const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
//     const { username, email, password } = req.body;

//     const existingUser = await userModel.findOne({ $or: [{ username }, { email }] });

//     if (existingUser) return res.status(400).json({ msg: "User already exists" });

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const hashedVarificationCode = await bcrypt.hash(verificationCode, 10);
//     await userModel.create({
//       username,
//       email,
//       password: hashedPassword,
//       verificationcode: hashedVarificationCode,
//     });
//     res.status(200).json({ msg: "User registered successfully" });
//     try {
//       sendVerificationCode(email, verificationCode);
//     } catch (emailErr) {
//       res.status(201).json({
//         msg: "User registered, but verification email failed to send",
//         emailError: emailErr.message,
//       });
//     }

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


// exports.loginUser = async (req, res) => {
//   const { email, password } = req.body;
//   // console.log(req.body);

//   try {
//     const user = await userModel.findOne({ email: email });

//     if (!user) {
//       // User not found
//       return res.status(404).json({ message: 'User not found. Please sign up.' });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       // Incorrect password
//       return res.status(401).json({ message: 'Wrong password' });
//     }

//     // Safe to access user.username now
//     const name = user.username;
//     // console.log(name);

//     const userNameToken = jwt.sign({ username: name }, process.env.JWT_SECRET);
//     res.cookie('tokenName', userNameToken);

//     const token = jwt.sign({ email: email }, process.env.JWT_SECRET);
//     res.cookie('token', token);
//     // console.log(token);

//     return res.status(200).json({ message: 'Login successful' });

//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: 'Internal Server Error' });
//   }
// };



// exports.verifyToken = (req, res, next) => {
//   const token = req.cookies.token;
//   if (!token) return res.status(401).json({ msg: "No token, access denied" });

//   try {
//     const verified = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = verified;
//     next();
//   } catch (err) {
//     res.status(403).json({ msg: "Invalid token" });
//   }
// };

// exports.getNameToken = (req, res) =>{
//   const tokenName = req.cookies.tokenName
//   if (!tokenName) return res.status(401).json({ msg: "No token" });

//   try {
//     const verify = jwt.verify(tokenName, process.env.JWT_SECRET)
//     // console.log(verify.username);
//     res.json(verify.username)

//   } catch (error) {
//     console.log(error);

//   }
// }


// exports.getUsers = async (req, res) => {
//   const users = await userModel.find();
//   res.json(users);
// };


// exports.logoutUser = async (req, res) => {
//   res.clearCookie('token')
//   res.clearCookie('tokenName')
//   res.json({ msg: "logged out" })
// }

// exports.otpVerification = async (req, res) => {
//   try {
//     const { verificationcode, localEmail } = req.body;
//     if (!verificationcode) {
//       return res.status(400).json({ message: 'Verification code is required.' });
//     }
//     const user = await userModel.findOne({ email: localEmail });
//     let encryptedCode = user.verificationcode
//     const isMatch = await bcrypt.compare(verificationcode, encryptedCode);
//     if (isMatch) {
//       const token = jwt.sign({ verificationcode: encryptedCode }, process.env.JWT_SECRET)
//       res.cookie('token', token)
//       return res.status(200).json({ message: 'Verified' });
//     } else {
//       return res.status(404).json({ message: 'Invalid or expired verification code.' });
//     }

//   } catch (error) {
//     console.error('OTP verification error:', error);
//     return res.status(500).json({ message: 'Server error during verification.' });
//   }
// };

// exports.getMessages = async (req, res) => {
//   try {
//     const messages = await Message.find().sort({ createdAt: 1 });
//     res.json(messages);


//   } catch (err) {
//     res.status(500).json({ message: 'Server error' });
//   }
// }

// exports.checking = async (req, res) =>{
//   res.json("Server is live")
// }


import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import userModel from '../models/users.js';
import Message from '../models/message.js';
import { sendVerificationCode } from '../middleware/email.js';

// Register User
export const registerUser = async (req, res) => {
  try {
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const { username, email, password } = req.body;

    const existingUser = await userModel.findOne({ $or: [{ username }, { email }] });

    if (existingUser) return res.status(400).json({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedVarificationCode = await bcrypt.hash(verificationCode, 10);

    await userModel.create({
      username,
      email,
      password: hashedPassword,
      verificationcode: hashedVarificationCode,
    });

    res.status(200).json({ msg: "User registered successfully" });

    try {
      sendVerificationCode(email, verificationCode);
    } catch (emailErr) {
      res.status(201).json({
        msg: "User registered, but verification email failed to send",
        emailError: emailErr.message,
      });
    }

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login User
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user) return res.status(404).json({ message: 'User not found. Please sign up.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Wrong password' });

    const userNameToken = jwt.sign({ username: user.username }, process.env.JWT_SECRET);
    const token = jwt.sign({ email }, process.env.JWT_SECRET);

    // res.cookie('tokenName', userNameToken);
    // res.cookie('token', token);

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,         // required for HTTPS
      sameSite: 'None'      // required for cross-site
    });

    res.cookie('tokenName', userNameToken, {
      secure: true,
      sameSite: 'None'
    });

    return res.status(200).json({ message: 'Login successful' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Verify Token
export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ msg: "No token, access denied" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(403).json({ msg: "Invalid token" });
  }
};

// Get Username from Token
export const getNameToken = (req, res) => {
  const tokenName = req.cookies.tokenName;
  if (!tokenName) return res.status(401).json({ msg: "No token" });

  try {
    const verify = jwt.verify(tokenName, process.env.JWT_SECRET);
    res.json(verify.username);
  } catch (error) {
    console.log(error);
  }
};

// Get All Users
export const getUsers = async (req, res) => {
  const users = await userModel.find();
  res.json(users);
};

// Logout User
export const logoutUser = (req, res) => {
  res.clearCookie('token');
  res.clearCookie('tokenName');
  res.json({ msg: "logged out" });
};

// OTP Verification
export const otpVerification = async (req, res) => {
  try {
    const { verificationcode, localEmail } = req.body;

    if (!verificationcode) {
      return res.status(400).json({ message: 'Verification code is required.' });
    }

    const user = await userModel.findOne({ email: localEmail });
    const encryptedCode = user.verificationcode;

    const isMatch = await bcrypt.compare(verificationcode, encryptedCode);
    if (isMatch) {
      const token = jwt.sign({ verificationcode: encryptedCode }, process.env.JWT_SECRET);
      res.cookie('token', token);
      return res.status(200).json({ message: 'Verified' });
    } else {
      return res.status(404).json({ message: 'Invalid or expired verification code.' });
    }

  } catch (error) {
    console.error('OTP verification error:', error);
    return res.status(500).json({ message: 'Server error during verification.' });
  }
};

// Get All Messages
export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Health check
export const checking = async (req, res) => {
  res.json("Server is live");
};

