import User from "../../models/users/UserModel.js";
import Otp from "../../models/Otp/otpModel.js"; 
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { userRegisterationSchema, userLoginSchema } from "../../validoators/User/UserValidation.js";
import sendOtpByEmail from "../../services/emails/emailServiceOtp.js";
import sendPasswordResetEmail from "../../services/emails/passwordResetEmailService.js";
import { uploadToCloudinary } from "../upload/mediaService.js";

export const registeringUser = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ message: "Request body is required", status: 400 });
        }

        const {
            name,
            email,
            phone,
            password,
            profile,
            gender,
            profile_img: profileImgBody,
            id_Number,
            id_proof_img: idProofBody,
            category,
            shopName,
            shopAddress,
            shopLogo: shopLogoBody
        } = req.body;

        const profileFile = req.files?.profile_img?.[0];
        const idProofFile = req.files?.id_proof_img?.[0];
        const shopLogoFile = req.files?.shopLogo?.[0];

        console.log("Files received:", {
            profile_img: profileFile ? "yes" : "MISSING",
            id_proof_img: idProofFile ? "yes" : "MISSING",
            shopLogo: shopLogoFile ? "yes" : "MISSING"
        });

        let profile_img = profileImgBody;
        let profile_img_public_id = null;
        let id_proof_img = idProofBody;
        let id_proof_img_public_id = null;
        let shopLogo = shopLogoBody;
        let shopLogo_public_id = null;

        try {
            if (profileFile) {
                try {
                    const uploaded = await uploadToCloudinary(profileFile, "animarket/users/profile_images");
                    profile_img = uploaded.url;
                    profile_img_public_id = uploaded.public_id;
                    console.log("profile_img uploaded successfully");
                } catch (err) {
                    console.error("profile_img upload error:", err.message);
                    throw err;
                }
            } else {
                console.warn("profile_img file not received");
            }

            if (idProofFile) {
                try {
                    const uploaded = await uploadToCloudinary(idProofFile, "animarket/users/id_proofs");
                    id_proof_img = uploaded.url;
                    id_proof_img_public_id = uploaded.public_id;
                    console.log("id_proof_img uploaded successfully");
                } catch (err) {
                    console.error("id_proof_img upload error:", err.message);
                    throw err;
                }
            } else {
                console.warn("id_proof_img file not received");
            }

            if (shopLogoFile) {
                try {
                    const uploaded = await uploadToCloudinary(shopLogoFile, "animarket/users/shop_logos");
                    shopLogo = uploaded.url;
                    shopLogo_public_id = uploaded.public_id;
                    console.log("shopLogo uploaded successfully");
                } catch (err) {
                    console.error("shopLogo upload error:", err.message);
                    throw err;
                }
            } else {
                console.warn("shopLogo file not received");
            }
        } catch (error) {
            console.error("File upload error:", error);
            return res.status(500).json({ message: "File upload failed", error: error.message, status: 500 });
        }

        console.log("Debug - Values after upload:", {
            name, email, password, profile, gender, profile_img, id_Number, id_proof_img, category, shopName, shopAddress, shopLogo
        });

        if (!name || !email || !password || !profile || !gender || !profile_img || !id_Number || !id_proof_img || !category || !shopName || !shopAddress || !shopLogo) {
            return res.status(400).json({ 
                message: "all fields are required", 
                status: 400,
                missing: {
                    name: !name,
                    email: !email,
                    password: !password,
                    profile: !profile,
                    gender: !gender,
                    profile_img: !profile_img,
                    id_Number: !id_Number,
                    id_proof_img: !id_proof_img,
                    category: !category,
                    shopName: !shopName,
                    shopAddress: !shopAddress,
                    shopLogo: !shopLogo
                }
            });
        }

        const payload = {
            name,
            email,
            phone,
            password,
            profile,
            gender,
            profile_img,
            id_Number,
            id_proof_img,
            category,
            shopName,
            shopAddress,
            shopLogo
        };

        const result = userRegisterationSchema.validate(payload);
        if (result.error) {
            return res.status(400).json({ message: result.error.details[0].message, status: 400 });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.json({ message: "user already exists", status: 400 });
        }

        const emailOtp = otpGenerator.generate(6, {
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false,
            digits: true
        });

        const phoneOtp = otpGenerator.generate(6, {
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false,
            digits: true
        });

        const sendeotpemail = await sendOtpByEmail(email, emailOtp);
        if (!sendeotpemail) {
            return res.status(500).json({ message: "OTP sent failed", status: 500 });
        }

        const saveOtp = await Otp.create({
            email: email,
            emailOtp: emailOtp,
            phone: phone,
            phoneOtp: phoneOtp,
        });

        const saltValue = await bcrypt.genSalt(10);
        const hashpass = await bcrypt.hash(password, saltValue);

        const saveUser = await User.create({
            name,
            email,
            phone,
            password: hashpass,
            profile,
            gender,
            profile_img,
            profile_img_public_id,
            id_Number,
            id_proof_img,
            id_proof_img_public_id,
            category,
            shopName,
            shopAddress,
            shopLogo,
            shopLogo_public_id
        });

        if (saveUser) {
            return res.status(200).json({
                message: "user registered successfully",
                data: saveUser,
                status: 200
            });
        }

        return res.status(500).json({ message: "User registration failed", status: 500 });
    } catch (error) {
        console.error("Registration error:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message, status: 500 });
    }
};

export const LoginUser = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ message: "Request body is required", status: 400 });
    }

    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "email and password are required", status: 400 });
    }

    const result = userLoginSchema.validate(req.body);
    if (result.error) {
        return res.json({ message: result.error.details[0].message, status: 400 });
    }

    const userExists = await User.findOne({ email });
    if (!userExists) {
        return res.json({ message: "user not found", status: 404 });
    }

    const comparepass = await bcrypt.compare(password, userExists.password);
    if (comparepass) {
        const token = jwt.sign({ id: userExists._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        return res.json({
            message: "login success",
            status: 200,
            token,
            user: userExists
        });
    } else {
        return res.json({ message: "invalid password", status: 401 });
    }
};


export const getAlluser = async (req, res) => {
    const user = await User.find({});
    try {
        return res.json({
            message: "all user getted successfully",
            data: user,
            status: 200
        })
    } catch (error) {
        return res.json({
            message: "all user getted failed",
            error: error.message,
            status: 500
        })

    }
}

export const getoneUser = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!id && !user) {
        return res.json({
            message: "user not found",
            status: 404
        })
    } else {
        console.log("user id is found")
        console.log(user);
    }
    try {
        return res.json({
            message: "user getted successfully",
            data: user,
            status: 200
        })
    } catch (error) {
        return res.json({
            message: "user getted failed",
            error: error.message,
            status: 500
        })
    }
};

export const deleteUser = async (req, res) => {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    try {
        return res.json({
            message: "user deleted successfully",
            data: user,
            status: 200,
            role: user.role
        })
    } catch (error) {
        return res.json({
            message: "user deleted failed",
            error: error.message,
            status: 500
        })
    }
}

export const updateRole = async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;
    if (!id && role) {
        return res.json({
            message: "id and role is required",
            status: 400
        })
    }
    const user = await User.findByIdAndUpdate(id, { role });
    if (!user) {
        return res.json({
            message: "user not found",
            status: 404
        })
    } else {
        console.log("user id is found")
    }
    try {
        return res.json({
            message: "user role updated successfully",
            data: user,
            status: 200,
            role: user.role
        })
    } catch (error) {
        return res.json({
            message: "user role updated failed",
            error: error.message,
            status: 500
        })
    }
}

export const verifyUser = async (req, res) => {
    const { id } = req.params;
    const { isVerified } = req.body;
    if (!id && !isVerified) {
        return res.json({
            message: "id and isVerified is required",
            status: 400
        })
    }
    const user = await User.findByIdAndUpdate(id, { isVerified }, { new: true });
    if (!user) {
        return res.json({
            message: "user not found",
            status: 404
        })
    } else {
        console.log("user id is found")
    }
    try {
        return res.json({
            message: "user verified successfully",
            data: user,
            status: 200,
            isVerified: user.isVerified
        })
    } catch (error) {
        return res.json({
            message: "user verified failed",
            error: error.message,
            status: 500
        })
    }
}

export const userloggout = async (req, res) => {
    const { id } = req.params;
    const { token } = req.body;
    if (!token && !id) {
        return res.json({
            message: "token and id is required",
            status: 400
        })
    }
    const user = await User.findByIdAndUpdate(id, { token }, { new: true });
    if (!user) {
        return res.json({
            message: "user not found",
            status: 404
        })
    } else {
        console.log("user id is found")
    }
    try {
        return res.json({
            message: "user loggout successfully",
            data: user,
            status: 200,
            token: user.token
        })
    } catch (error) {
        return res.json({
            message: "user loggout failed",
            error: error.message,
            status: 500
        })
    }

}

export const resetPassword = async (req, res) => {
    try {
        const { email, oldPassword, newPassword, confirmPassword } = req.body;

        // Validation
        if (!email || !oldPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({
                message: "email, oldPassword, newPassword, and confirmPassword are required",
                status: 400
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                message: "new password and confirm password do not match",
                status: 400
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                message: "new password must be at least 6 characters long",
                status: 400
            });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "user not found",
                status: 404
            });
        }

        // Verify old password
        const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "old password is incorrect",
                status: 401
            });
        }

        // Hash new password
        const saltValue = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, saltValue);

        // Update user password
        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            { password: hashedPassword },
            { new: true }
        );

        return res.status(200).json({
            message: "password reset successfully",
            status: 200,
            data: updatedUser
        });
    } catch (error) {
        console.error("Reset password error:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message,
            status: 500
        });
    }
}

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Validation
        if (!email) {
            return res.status(400).json({
                message: "email is required",
                status: 400
            });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "user not found with this email",
                status: 404
            });
        }

        // Generate 6-digit OTP
        const resetOTP = otpGenerator.generate(6, {
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false,
            digits: true
        });

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString("hex");

        // Hash the reset token
        const hashedResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");

        // Set token expiry (1 hour)
        const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

        // Set OTP expiry (30 minutes)
        const resetOTPExpiry = new Date(Date.now() + 30 * 60 * 1000);

        // Save OTP, reset token and their expiries to user
        await User.findByIdAndUpdate(
            user._id,
            {
                resetOTP: resetOTP,
                resetOTPExpiry: resetOTPExpiry,
                resetToken: hashedResetToken,
                resetTokenExpiry: resetTokenExpiry
            },
            { new: true }
        );

        // Send email with OTP and reset link
        const emailSent = await sendPasswordResetEmail(email, resetOTP, resetToken);
        if (!emailSent) {
            return res.status(500).json({
                message: "Failed to send reset password email",
                status: 500
            });
        }

        return res.status(200).json({
            message: "Password reset email sent successfully. Check your email for OTP and reset link",
            status: 200,
            email: email
        });
    } catch (error) {
        console.error("Forgot password error:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message,
            status: 500
        });
    }
}

export const verifyResetOTP = async (req, res) => {
    try {
        const { email, resetOTP } = req.body;

        // Validation
        if (!email || !resetOTP) {
            return res.status(400).json({
                message: "email and OTP are required",
                status: 400
            });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "user not found",
                status: 404
            });
        }

        // Check if OTP exists and is not expired
        if (!user.resetOTP || !user.resetOTPExpiry) {
            return res.status(400).json({
                message: "No password reset request found. Please request a password reset first",
                status: 400
            });
        }

        // Check if OTP is expired
        if (new Date() > user.resetOTPExpiry) {
            // Clear expired OTP
            await User.findByIdAndUpdate(user._id, {
                resetOTP: null,
                resetOTPExpiry: null
            });
            return res.status(400).json({
                message: "OTP has expired. Please request a new password reset",
                status: 400
            });
        }

        // Verify OTP
        if (user.resetOTP !== resetOTP) {
            return res.status(401).json({
                message: "Invalid OTP",
                status: 401
            });
        }

        return res.status(200).json({
            message: "OTP verified successfully",
            status: 200,
            verified: true
        });
    } catch (error) {
        console.error("Verify OTP error:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message,
            status: 500
        });
    }
}

export const confirmResetPassword = async (req, res) => {
    try {
        const { resetToken, newPassword, confirmPassword } = req.body;

        // Validation
        if (!resetToken || !newPassword || !confirmPassword) {
            return res.status(400).json({
                message: "resetToken, newPassword, and confirmPassword are required",
                status: 400
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                message: "passwords do not match",
                status: 400
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                message: "password must be at least 6 characters long",
                status: 400
            });
        }

        // Hash the reset token to match with stored token
        const hashedResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");

        // Find user by reset token
        const user = await User.findOne({
            resetToken: hashedResetToken,
            resetTokenExpiry: { $gt: new Date() } // Token not expired
        });

        if (!user) {
            return res.status(400).json({
                message: "Invalid or expired reset token",
                status: 400
            });
        }

        // Hash the new password
        const saltValue = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, saltValue);

        // Update user password and clear reset token and OTP
        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null,
                resetOTP: null,
                resetOTPExpiry: null
            },
            { new: true }
        );

        return res.status(200).json({
            message: "Password reset successfully. You can now login with your new password",
            status: 200,
            data: updatedUser
        });
    } catch (error) {
        console.error("Confirm reset password error:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message,
            status: 500
        });
    }
}
