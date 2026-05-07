import User from "../../models/users/UserModel.js";
import Otp from "../../models/Otp/otpModel.js"; 
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
import crypto from "crypto";
import { userRegisterationSchema, userLoginSchema } from "../../validoators/User/UserValidation.js";
import sendOtpByEmail from "../../services/emails/emailServiceOtp.js";
import sendPasswordResetEmail from "../../services/emails/passwordResetEmailService.js";
import { uploadToCloudinary } from "../upload/mediaService.js";

export const registeringUser = async (req, res) => {
    try {
        const {
            name, email, phone, password, profile, gender, id_Number,
            category, shopName, shopAddress
        } = req.body;

        const profileFile = req.files?.profile_img?.[0];
        const idProofFile = req.files?.id_proof_img?.[0];
        const shopLogoFile = req.files?.shopLogo?.[0];

        let profile_img = null, profile_img_public_id = null;
        let id_proof_img = null, id_proof_img_public_id = null;
        let shopLogo = null, shopLogo_public_id = null;

        if (profileFile) {
            const uploaded = await uploadToCloudinary(profileFile, "animarket/users/profile_images");
            profile_img = uploaded.url;
            profile_img_public_id = uploaded.public_id;
        }
        if (idProofFile) {
            const uploaded = await uploadToCloudinary(idProofFile, "animarket/users/id_proofs");
            id_proof_img = uploaded.url;
            id_proof_img_public_id = uploaded.public_id;
        }
        if (shopLogoFile) {
            const uploaded = await uploadToCloudinary(shopLogoFile, "animarket/users/shop_logos");
            shopLogo = uploaded.url;
            shopLogo_public_id = uploaded.public_id;
        }

        const payload = {
            name, email, phone, password, profile, gender, id_Number,
            category, shopName, shopAddress, profile_img, id_proof_img, shopLogo
        };

        const result = userRegisterationSchema.validate(payload);
        if (result.error) {
            return res.status(400).json({ message: result.error.details[0].message, status: 400 });
        }

        if (await User.findOne({ email })) {
            return res.status(400).json({ message: "User already exists", status: 400 });
        }

        const emailOtp = otpGenerator.generate(6, { digits: true });
        const phoneOtp = otpGenerator.generate(6, { digits: true });

        const emailSent = await sendOtpByEmail(email, emailOtp);
        if (!emailSent) {
            return res.status(500).json({ message: "Failed to send OTP", status: 500 });
        }

        await Otp.create({ email, emailOtp, phone, phoneOtp });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            ...payload,
            password: hashedPassword,
            profile_img,
            profile_img_public_id,
            id_proof_img,
            id_proof_img_public_id,
            shopLogo,
            shopLogo_public_id
        });
        return res.status(201).json({
            message: "User registered successfully. Awaiting admin approval.",
            data: newUser,
            status: 201
        });

    } catch (error) {
        console.error("Registration error:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message, status: 500 });
    }
};

export const LoginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required", status: 400 });
        }

        const result = userLoginSchema.validate(req.body);
        if (result.error) {
            return res.status(400).json({ message: result.error.details[0].message, status: 400 });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found", status: 404 });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid password", status: 401 });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "48hours" });

        return res.status(200).json({
            message: "Login successful",
            status: 200,
            token,
            user: { ...user.toObject(), password: undefined }
        });
    } catch (error) {
        return res.status(500).json({ message: "Login failed", error: error.message, status: 500 });
    }
};

export const getAlluser = async (req, res) => {
    try {
        const users = await User.find({}).select("-password");
        return res.status(200).json({
            message: "All users fetched successfully",
            data: users,
            status: 200
        });
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch users", error: error.message, status: 500 });
    }
};

export const getoneUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found", status: 404 });

        return res.status(200).json({
            message: "User fetched successfully",
            data: user,
            status: 200
        });
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch user", error: error.message, status: 500 });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found", status: 404 });

        return res.status(200).json({ message: "User deleted successfully", status: 200 });
    } catch (error) {
        return res.status(500).json({ message: "Delete failed", error: error.message, status: 500 });
    }
};

export const updateRole = async (req, res) => {
    try {
        const { role } = req.body;
        if (!role) return res.status(400).json({ message: "Role is required", status: 400 });

        const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
        if (!user) return res.status(404).json({ message: "User not found", status: 404 });

        return res.status(200).json({
            message: "Role updated successfully",
            data: user,
            status: 200
        });
    } catch (error) {
        return res.status(500).json({ message: "Role update failed", error: error.message, status: 500 });
    }
};

export const verifyUser = async (req, res) => {
    try {
        const { isVerified } = req.body;
        if (typeof isVerified !== "boolean") {
            return res.status(400).json({ message: "isVerified must be boolean", status: 400 });
        }

        const user = await User.findByIdAndUpdate(req.params.id, { isVerified }, { new: true });
        if (!user) return res.status(404).json({ message: "User not found", status: 404 });

        return res.status(200).json({
            message: "User verification updated successfully",
            data: user,
            status: 200
        });
    } catch (error) {
        return res.status(500).json({ message: "Verification failed", error: error.message, status: 500 });
    }
};

export const userloggout = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { token: null }, { new: true });
        if (!user) return res.status(404).json({ message: "User not found", status: 404 });

        return res.status(200).json({ message: "User logged out successfully", status: 200 });
    } catch (error) {
        return res.status(500).json({ message: "Logout failed", error: error.message, status: 500 });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { email, oldPassword, newPassword, confirmPassword } = req.body;

        if (!email || !oldPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({ message: "All fields are required", status: 400 });
        }
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "New password and confirm password do not match", status: 400 });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters", status: 400 });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found", status: 404 });

        const isCorrect = await bcrypt.compare(oldPassword, user.password);
        if (!isCorrect) return res.status(401).json({ message: "Old password is incorrect", status: 401 });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        const updatedUser = await User.findByIdAndUpdate(user._id, { password: hashedPassword }, { new: true });

        return res.status(200).json({ message: "Password reset successful", status: 200, data: updatedUser });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message, status: 500 });
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: "Email is required", status: 400 });

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found", status: 404 });

        const resetOTP = otpGenerator.generate(6, { digits: true });
        const resetToken = crypto.randomBytes(32).toString("hex");
        const hashedResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");

        const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);
        const resetOTPExpiry = new Date(Date.now() + 30 * 60 * 1000);

        await User.findByIdAndUpdate(user._id, {
            resetOTP, resetOTPExpiry,
            resetToken: hashedResetToken,
            resetTokenExpiry
        });

        const emailSent = await sendPasswordResetEmail(email, resetOTP, resetToken);
        if (!emailSent) return res.status(500).json({ message: "Failed to send email", status: 500 });

        return res.status(200).json({
            message: "Password reset email sent successfully",
            status: 200
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message, status: 500 });
    }
};

export const verifyResetOTP = async (req, res) => {
    try {
        const { email, resetOTP } = req.body;
        if (!email || !resetOTP) return res.status(400).json({ message: "Email and OTP are required", status: 400 });

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found", status: 404 });

        if (!user.resetOTP || new Date() > user.resetOTPExpiry) {
            return res.status(400).json({ message: "OTP expired or invalid", status: 400 });
        }

        if (user.resetOTP !== resetOTP) {
            return res.status(401).json({ message: "Invalid OTP", status: 401 });
        }

        return res.status(200).json({ message: "OTP verified successfully", status: 200 });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message, status: 500 });
    }
};

export const confirmResetPassword = async (req, res) => {
    try {
        const { resetToken, newPassword, confirmPassword } = req.body;

        if (!resetToken || !newPassword || !confirmPassword) {
            return res.status(400).json({ message: "All fields are required", status: 400 });
        }
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match", status: 400 });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters", status: 400 });
        }

        const hashedResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");

        const user = await User.findOne({
            resetToken: hashedResetToken,
            resetTokenExpiry: { $gt: new Date() }
        });

        if (!user) return res.status(400).json({ message: "Invalid or expired token", status: 400 });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        const updatedUser = await User.findByIdAndUpdate(user._id, {
            password: hashedPassword,
            resetToken: null,
            resetTokenExpiry: null,
            resetOTP: null,
            resetOTPExpiry: null
        }, { new: true });

        return res.status(200).json({
            message: "Password reset successful. You can now login.",
            status: 200,
            data: updatedUser
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message, status: 500 });
    }
};