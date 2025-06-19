import nodemailer from 'nodemailer'
import dotenv from 'dotenv';
dotenv.config();

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL,
    pass: process.env.ACCOUNT_PASS,
  },
}); 


// const sendEmail = async () => {
//     try {
//         const info = await transporter.sendMail({
//     from: '"Chatterboc" <chatterboox436@gmail.com>',
//     to: "abhijit36254@gmail.com",
//     subject: "Hello ✔",
//     text: "Hello world?", // plain‑text body
//     html: "<b>Hello world?</b>", // HTML body
//   });
//   console.log("Message sent:", info.messageId);
//     } catch (error) {
//         console.log(error)
//     }
// };

// sendEmail()