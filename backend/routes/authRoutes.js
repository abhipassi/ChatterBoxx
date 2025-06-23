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

// route for creating a user
router.post('/user_create', registerUser)

// route for login a user
router.post('/user_login',loginUser)

// route for logout 
router.get('/logout' ,logoutUser)

// jwt verification route
router.get('/verifyToken', verifyToken)

// get user routes
// router.get('/getUsers', verifyToken, getUsers)
router.get('/getUsers', getUsers)

// otp verification
router.post('/otp',otpVerification)

// for getting message
router.get('/getMessages', getMessages);

// for saving name 

router.get('/tokenName' , getNameToken)

module.exports = router;
