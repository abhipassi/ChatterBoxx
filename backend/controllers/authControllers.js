const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const userModel = require('../models/users');
const Message = require('../models/message');
const { sendVerificationCode } = require('../middleware/email');



exports.registerUser = async (req, res) => {
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


// exports.loginUser = async (req,res)=> {
//   // password compare 
//   var {email , password} = req.body
//   console.log(req.body);


//   try {
//     let user = await userModel.findOne({email: email})
//     console.log(user);
//     if(user){
//       const isMatch =  bcrypt.compare(password,user.password)
//       if(isMatch){

//       let token = jwt.sign({email:email },process.env.JWT_SECRET)
//       res.cookie('token',token)
//       //  return res.redirect('index.html')
//       }
//       else{
//         if (!isMatch) return res.redirect('/login.html?msg=wrong_password');
//       }
//     }
//     if(!user){  
//     //  alert("user not found please signup first")
//     //  res.redirect('signUp.html')
//     return res.redirect('/signUp.html?msg=user_not_found');
//     }
//   } catch (error) {
//     console.log(error);
//   }
// }



exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);

  try {
    const user = await userModel.findOne({ email: email });
    console.log(user);

    if (!user) {
      // User not found
      return res.status(404).json({ message: 'User not found. Please sign up.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Incorrect password
      return res.status(401).json({ message: 'Wrong password' });
    }
    // Successful login
    // const token = jwt.sign({ email: email }, process.env.JWT_SECRET, {
    //   expiresIn: '1d',
    // });

    // res.cookie('token', token, {
    //   httpOnly: true,
    //   sameSite: 'Lax', // or 'Strict'/'None' if using cross-site cookies
    //   secure: false // set to true in production with HTTPS
    // });
    const token = jwt.sign({ email: email }, process.env.JWT_SECRET)
    res.cookie('token', token)
    console.log(token);


    return res.status(200).json({ message: 'Login successful' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};


exports.verifyToken = (req, res, next) => {
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



exports.getUsers = async (req, res) => {
  const users = await userModel.find();
  res.json(users);
};


exports.logoutUser = async (req, res) => {
  res.clearCookie('token')
  res.json({ msg: "logged out" })
}


exports.otpVerification = async (req, res) => {
  try {
    const { verificationcode, localEmail } = req.body;
    if (!verificationcode) {
      return res.status(400).json({ message: 'Verification code is required.' });
    }
    // let localEmail = localStorage.getItem("userEmail")
    // console.log(localEmail);
    const user = await userModel.findOne({ email: localEmail });
    let encryptedCode = user.verificationcode
    const isMatch = await bcrypt.compare(verificationcode, encryptedCode);
    if (isMatch) {
      const token = jwt.sign({ verificationcode: encryptedCode }, process.env.JWT_SECRET)
      res.cookie('token', token)
      return res.status(200).json({ message: 'Verified' });
    } else {
      return res.status(404).json({ message: 'Invalid or expired verification code.' });
    }

  } catch (error) {
    console.error('OTP verification error:', error);
    return res.status(500).json({ message: 'Server error during verification.' });
  }
};



exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}
