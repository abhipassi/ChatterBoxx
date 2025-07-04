import { transporter } from "./emailconfig.js";
import { Verification_Email_Template } from "./emailtemplate.js";
import dotenv from 'dotenv';
dotenv.config();

export const sendVerificationCode = async (email, verificationCode) => {
    try {

        const response = await transporter.sendMail({
            from: `"Chatterbox" <${process.env.EMAIL}>`,
            to: email,
            subject: "Email Verification",
            text: "Hello world?", // plain‑text body
            html: Verification_Email_Template.replace("{verificationCode}",verificationCode), // HTML body
        });
        console.log('Email sent',response)
    } catch (error) {
        console.log(error)
    }
}