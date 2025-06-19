import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';


function SignUp() {

  const [fullname, setFullname] = useState()
  const [password, setPassword] = useState()
  const [email, setEmail] = useState()
  const [confirmPass, setConfirmPass] = useState()

  let regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passRegex = new RegExp("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&\\-+=()])(?=\\S+$).{8,20}$");
  let passError = "Password must be 8-20 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character.No spaces allowed"


  const navigate = useNavigate()

  let handleName = (e) => {
  let sanitizedName = e.target.value.trim();
  setFullname(sanitizedName);
}

let handleEmail = (e) => {
  let sanitizedEmail = e.target.value.trim();
  setEmail(sanitizedEmail);
}

let handlePassword = (e) => {
  let sanitizedPassword = e.target.value.trim();
  setPassword(sanitizedPassword);
}

let handleConfirmPass = (e) => {
  let sanitizedConfirmPassword = e.target.value.trim();
  setConfirmPass(sanitizedConfirmPassword);
}


  let handleSubmit = async (e) => {
    e.preventDefault()
    let data = {
      username: fullname,
      email: email,
      password: password
    }

    if (!fullname || !email || !password || !confirmPass) {
      return toast.error("Kindly fill all the credentials");
    }

    else if (!regex.test(email)) {
      return toast.error("Kindly enter valid email address")
    }

    if (password !== confirmPass) {
      return toast.error("Password Does not Match")
    }

    else if (!passRegex.test(password)) {
      return toast.error(passError)
    }


    try {
      let localEmail = data.email
      localStorage.setItem('userEmail', localEmail);
      let response = await axios.post("http://localhost:4000/user_create", data)
      if (response.status === 200) {
        toast.success("Otp Sent")
        navigate('/otpverify')
      }
    } catch (error) {

      if (error.response && error.response.status === 400) {
        // user already exists
        toast.error("User already exists")
      }
      // something went wrong 
      else if (error.response.status === 500) {
        toast.error("Something went wrong")
      }
      // email verification failed
      else if (error.response.status === 201) {
        toast.error("Email verification failed")

      }
      else {
        console.error("Unexpected error:", error);
        toast.error("Unexpected error")

      }
    }

  }


  return (
    <>
      <div className=' flex justify-center items-center h-screen w-screen bg-colorOne'>
        <form className='flex flex-col justify-center items-center bg-colorTwo h-auto p-10 w-96 rounded-2xl shadow-2xl'>
          <h2 className='font-semibold text-2xl' >SignUp</h2>

          <br />
          <br />

          <p className='font-semibold text-center w-full'>Enter your full Name</p>
          <input type='text' onChange={handleName}  className='border-2 h-7 p-1 border-black w-56 rounded-md focus:shadow-md hover:border-colorThree transition duration-300 ease' />
          <br />

          <p className='font-semibold text-center w-full'>Enter your email address </p>
          <input type='email' onChange={handleEmail} className='border-2 h-7 p-1 border-black w-56 rounded-md focus:shadow-md hover:border-colorThree transition duration-300 ease ' />

          <br />
          <p className='font-semibold text-center w-full'>Enter your password</p>
          <input type='password' onChange={handlePassword} className='border-2 h-7 p-1 border-black w-56 rounded-md focus:shadow-md hover:border-colorThree transition duration-300 ease ' />
          <br />

          <p className='font-semibold text-center w-full'>Confirm your password</p>
          <input type='password' onChange={handleConfirmPass} className='border-2 h-7 p-1 border-black w-56 rounded-md focus:shadow-md hover:border-colorThree transition duration-300 ease ' />
          <br />
          <input type='submit' value="SignUp" onClick={handleSubmit} className='bg-transparent hover:bg-colorThree text-black-700 font-semibold hover:text-white py-2 px-4 border border-colorThree hover:border-transparent rounded' />

          <a href="/" className='text-sm mt-4'>Already a User? Click <span className="text-blue-600 underline">here</span> to Login</a>
        </form>

      </div>
    </>
  )
}

export default SignUp