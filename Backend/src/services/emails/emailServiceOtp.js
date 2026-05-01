import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const sendOtpByEmail = async (email, otp) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const template = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <style>
                body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f9fafb; margin: 0; padding: 20px; }
                .container { max-width: 500px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #eef2f6; }
                .header { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 40px 20px; text-align: center; color: #ffffff; }
                .header h1 { margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; }
                .content { padding: 40px 30px; text-align: center; }
                .otp-card { background: #f8fafc; border-radius: 12px; padding: 30px; margin-bottom: 25px; border: 1px dashed #cbd5e1; }
                .otp-code { font-size: 42px; font-weight: 800; color: #1e293b; letter-spacing: 8px; margin: 0; }
                .otp-text { color: #64748b; font-size: 14px; line-height: 1.6; margin-top: 20px; }
                .info-box { background-color: #f0f9ff; border-radius: 8px; padding: 15px; text-align: left; margin-top: 20px; }
                .info-box p { margin: 5px 0; color: #0369a1; font-size: 13px; }
                .footer { padding: 25px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
                .footer a { color: #4f46e5; text-decoration: none; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Verify Your Identity</h1>
                </div>
                <div class="content">
                    <p style="color: #475569; font-weight: 500; margin-bottom: 25px;">Hello,</p>
                    <div class="otp-card">
                        <div class="otp-code">${otp}</div>
                    </div>
                    <p class="otp-text">Enter this 6-digit code in the app to complete your registration. This code will expire in 10 minutes.</p>
                    <div class="info-box">
                        <p><strong>Requesting Email:</strong> ${email}</p>
                    </div>
                </div>
                <div class="footer">
                    <p>© ${new Date().getFullYear()} <strong>Animarketing Tech</strong>. All rights reserved.</p>
                    <p>Secure account verification system.</p>
                </div>
            </div>
        </body>
        </html>`;

        const mailOptions = {
            from: `"Animarketing Tech" <${process.env.EMAIL_USER}>`, // Added a professional sender name
            to: email,
            subject: `🔒 ${otp} is your verification code`, // Subject line includes the OTP for convenience
            html: template 
        };

        await transporter.sendMail(mailOptions);
        console.log("✅ OTP sent successfully to:", email);
        return true; 
    }
    catch (error) {
        console.log("❌ OTP sent failed:", error.message);
        return false; 
    }
}

export default sendOtpByEmail;
