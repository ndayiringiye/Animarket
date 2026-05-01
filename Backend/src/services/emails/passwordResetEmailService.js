import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const sendPasswordResetEmail = async (email, resetOTP, resetToken) => {
    try {
        const { EMAIL_USER, EMAIL_PASS, FRONTEND_URL } = process.env;
        if (!EMAIL_USER || !EMAIL_PASS) {
            throw new Error("Missing EMAIL_USER or EMAIL_PASS environment variables");
        }

        const resetLink = `${FRONTEND_URL}/reset-password?token=${resetToken}`;

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: EMAIL_USER,
                pass: EMAIL_PASS
            },
            connectionTimeout: 10000,
            greetingTimeout: 10000,
            socketTimeout: 10000,
            tls: {
                rejectUnauthorized: false
            }
        });

        const template = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <style>
                body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f9fafb; margin: 0; padding: 20px; }
                .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #eef2f6; }
                .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 40px 20px; text-align: center; color: #ffffff; }
                .header h1 { margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; }
                .content { padding: 40px 30px; }
                .greeting { color: #475569; font-weight: 500; margin-bottom: 20px; }
                .section { margin-bottom: 30px; }
                .section-title { color: #1e293b; font-size: 16px; font-weight: 600; margin-bottom: 15px; }
                .otp-card { background: #fef2f2; border-radius: 12px; padding: 25px; margin-bottom: 20px; border: 2px dashed #fecaca; text-align: center; }
                .otp-code { font-size: 48px; font-weight: 800; color: #991b1b; letter-spacing: 6px; margin: 0; font-family: 'Courier New', monospace; }
                .otp-expiry { color: #dc2626; font-size: 13px; margin-top: 12px; font-weight: 500; }
                .button-container { text-align: center; margin: 25px 0; }
                .reset-btn { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block; }
                .reset-btn:hover { opacity: 0.9; }
                .link-text { color: #64748b; font-size: 13px; margin-top: 10px; word-break: break-all; }
                .info-box { background-color: #fef2f2; border-radius: 8px; padding: 15px; border-left: 4px solid #ef4444; margin-top: 20px; }
                .info-box p { margin: 5px 0; color: #7f1d1d; font-size: 13px; }
                .security-note { background-color: #f0fdf4; border-radius: 8px; padding: 15px; border-left: 4px solid #22c55e; margin-top: 20px; }
                .security-note p { margin: 5px 0; color: #166534; font-size: 13px; }
                .footer { padding: 25px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
                .footer a { color: #ef4444; text-decoration: none; }
                .step { color: #475569; font-size: 14px; margin: 10px 0; }
                .step strong { color: #1e293b; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🔐 Reset Your Password</h1>
                </div>
                <div class="content">
                    <p class="greeting">Hello,</p>
                    <p style="color: #64748b; line-height: 1.6;">We received a request to reset your password. Please follow the steps below to complete the reset process.</p>
                    
                    <div class="section">
                        <div class="section-title">Step 1: Verify with OTP</div>
                        <p style="color: #64748b; font-size: 14px;">Enter this 6-digit code when prompted:</p>
                        <div class="otp-card">
                            <div class="otp-code">${resetOTP}</div>
                            <div class="otp-expiry">⏱️ Code expires in 30 minutes</div>
                        </div>
                    </div>

                    <div class="section">
                        <div class="section-title">Step 2: Reset Your Password</div>
                        <p style="color: #64748b; font-size: 14px; margin-bottom: 15px;">Click the button below to access the password reset page:</p>
                        <div class="button-container">
                            <a href="${resetLink}" class="reset-btn">Reset Password</a>
                        </div>
                        <p class="link-text">Or copy this link: <br><strong>${resetLink}</strong></p>
                    </div>

                    <div class="info-box">
                        <p><strong>⚠️ Important:</strong></p>
                        <p>• This reset link is valid for 1 hour</p>
                        <p>• The OTP code is valid for 30 minutes</p>
                        <p>• Request Email: <strong>${email}</strong></p>
                    </div>

                    <div class="security-note">
                        <p><strong>🔒 Security Tip:</strong> If you didn't request this password reset, please ignore this email. Your account is secure.</p>
                    </div>

                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 13px;">
                        <p>For any issues, please contact our support team.</p>
                    </div>
                </div>
                <div class="footer">
                    <p>© ${new Date().getFullYear()} <strong>Animarketing Tech</strong>. All rights reserved.</p>
                    <p>Secure password reset system.</p>
                </div>
            </div>
        </body>
        </html>`;

        const mailOptions = {
            from: `"Animarketing Tech Security" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "🔐 Reset Your Password - Action Required",
            html: template
        };

        await transporter.sendMail(mailOptions);
        console.log("✅ Password reset email sent successfully to:", email);
        return true;
    }
    catch (error) {
        console.log("❌ Password reset email failed:", error.message);
        return false;
    }
};

export default sendPasswordResetEmail;
