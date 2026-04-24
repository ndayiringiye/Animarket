import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const sendOtpByEmail = async(email,otp) => {
    try{
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "OTP for verification",
            text: `Your OTP is ${otp}`
        };
        await transporter.sendMail(mailOptions);
        console.log("OTP sent successfully");
    }
    catch(error){
        console.log("OTP sent failed",error.message);
    }
}
