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
            html: template
        };
        const template = `
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>One-Time Password</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f4f7f6;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: url('https://www.transparenttextures.com/patterns/cubes.png');
        }
        .container {
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            width: 100%;
            max-width: 500px;
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 30px;
            text-align: center;
        }
        .header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 28px;
            font-weight: 700;
        }
        .content {
            padding: 40px 30px;
            text-align: center;
        }
        .otp-box {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 15px;
        }
        .otp-code {
            font-size: 48px;
            font-weight: 800;
            color: #333;
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            letter-spacing: 10px;
            text-shadow: 0 2px 5px rgba(240, 147, 251, 0.3);
        }
        .otp-text {
            font-size: 16px;
            color: #666;
            margin-bottom: 20px;
            line-height: 1.6;
        }
        .info-box {
            background-color: #e8f0fe;
            border-left: 5px solid #4a90e2;
            padding: 15px 20px;
            margin-top: 30px;
            text-align: left;
            border-radius: 5px;
        }
        .info-box p {
            margin: 0;
            color: #333;
            font-size: 14px;
            line-height: 1.6;
        }
        .footer {
            background-color: #f8f9fa;
            padding: 20px 30px;
            text-align: center;
            font-size: 12px;
            color: #999;
            border-top: 1px solid #eee;
        }
        .footer a {
            color: #4a90e2;
            text-decoration: none;
            font-weight: 600;
        }
        .pulse {
            animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse {
            0%, 100% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.05);
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔒 Verify Your Account</h1>
        </div>
        <div class="content">
            <div class="otp-box">
                <div class="otp-code pulse">${otp}</div>
            </div>
            <p class="otp-text">Please use the code above to verify your identity. It will expire in 10 minutes.</p>
            <div class="info-box">
                <p><strong>📧 Email:</strong> ${email}</p>
                <p style="margin-top: 10px;"><strong>🔒 OTP:</strong> ${otp}</p>
            </div>
        </div>
        <div class="footer">
            <p>© ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
            <p>If you didn't request this, please ignore this email.</p>
        </div>
    </div>
</body>
</html>
        `
        await transporter.sendMail(mailOptions);
        console.log("OTP sent successfully");
    }
    catch(error){
        console.log("OTP sent failed",error.message);
    }
}
