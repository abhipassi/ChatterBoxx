const express = require('express')
const router = express.Router()

const {
    registerUser,
    loginUser,
    logoutUser,
    verifyToken,
    getUsers,
    otpVerification,
    getMessages,
    getNameToken
} = require('../controllers/authControllers')

// PUBLIC ROUTES

// route for creating a user
router.post('/user_create', registerUser)   

// route for login a user
router.post('/user_login', loginUser)
// protected routes 

// otp verification
router.post('/otp', otpVerification)


// PROTECTED ROUTES 

// route for logout 
router.get('/logout', verifyToken, logoutUser)

// jwt verification route
router.get('/verifyToken', verifyToken)

// get user routes
router.get('/getUsers', verifyToken, getUsers)
// router.get('/getUsers', getUsers)

// for getting message
router.get('/getMessages', verifyToken , getMessages);

// for saving name 
router.get('/tokenName', verifyToken, getNameToken)

module.exports = router;
