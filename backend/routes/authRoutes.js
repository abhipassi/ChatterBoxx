// const express = require('express')
// const router = express.Router()

// const {
//     registerUser,
//     loginUser,
//     logoutUser,
//     verifyToken,
//     getUsers,
//     otpVerification,
//     getMessages,
//     getNameToken,
//     checking
// } = require('../controllers/authControllers')

// // PUBLIC ROUTES

// // route for creating a user
// router.post('/user_create', registerUser)   

// // route for login a user
// router.post('/user_login', loginUser)
// // protected routes 

// // otp verification
// router.post('/otp', otpVerification)

// router.get('/check',checking )


// // PROTECTED ROUTES 

// // route for logout 
// router.get('/logout', verifyToken, logoutUser)

// // jwt verification route
// router.get('/verifyToken', verifyToken)

// // get user routes
// router.get('/getUsers', verifyToken, getUsers)
// // router.get('/getUsers', getUsers)

// // for getting message
// router.get('/getMessages', verifyToken , getMessages);

// // for saving name 
// router.get('/tokenName', verifyToken, getNameToken)

// module.exports = router;


import { Router } from 'express';
const router = Router();

import {
  registerUser,
  loginUser,
  logoutUser,
  verifyToken,
  getUsers,
  otpVerification,
  getMessages,
  getNameToken,
  checking
} from '../controllers/authControllers.js';

// === PUBLIC ROUTES ===

// Create a new user
router.post('/user_create', registerUser);

// Login a user
router.post('/user_login', loginUser);

// OTP verification
router.post('/otp', otpVerification);

// Health check
router.get('/check', checking);

// === PROTECTED ROUTES ===

// Logout
router.get('/logout', verifyToken, logoutUser);

// Verify token
router.get('/verifyToken', verifyToken);

// Get all users
router.get('/getUsers', verifyToken, getUsers);

// Get all messages
router.get('/getMessages', verifyToken, getMessages);

// Get username from token
router.get('/tokenName', verifyToken, getNameToken);

export default router;
