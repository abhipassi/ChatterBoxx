import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';

function OtpModal() {
  const navigate = useNavigate()

  let [inputValue, setInputValue] = useState()

  let handleChange = (e) => {
    let value = e.target.value
    setInputValue(value)
  }
  let handleVerify = async () => {
    try {
      let localEmail = localStorage.getItem("userEmail")

      let data = {
        verificationcode: inputValue.trim(),
        localEmail: localEmail
      }
      let response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/otp`, data, {
        withCredentials: true
      })
      //  console.log(response.data,"done");
      if (response.status === 200) {
        toast.success("SignUp Success")
        navigate('/')
        localStorage.removeItem("userEmail")
      }

    } catch (error) {
      if (error.response.status === 404) {
        // alert('Invalid or expired verification code')
        return toast.error("Invalid or expired verification code")
      }
      else if (error.response.status === 500) {
        // alert('OTP verification error')
        return toast.error("OTP verification error")
      }
      console.error('Verification failed:', error);
      return toast.error("Verification failed")
    }
  }
  return (
    <div className=' flex justify-center items-center h-screen w-screen bg-colorOne'> <div className='flex flex-col justify-center items-center bg-colorTwo h-auto p-10 w-96 rounded-2xl shadow-2xl'>
      <h2 className='font-semibold text-2xl'>Verification</h2>

      <br />
      <br />

      <p className='font-semibold text-center w-full'>Enter the OTP sent on your email</p>
      <input type='text' onChange={handleChange} className='border-2 border-black w-56 rounded-md focus:shadow-md hover:border-colorThree transition duration-300 ease h-7 p-1 ' />
      {/* <p className='font-semibold mr-4 text-red-600'>Invalid or expired verification code</p> */}
      <br />
      <input type='button' onClick={handleVerify} value="Submit" className='bg-transparent hover:bg-colorThree text-black-700 font-semibold hover:text-white py-2 px-4 border border-colorThree hover:border-transparent rounded' />

    </div>





    </div>
  )
}

export default OtpModal