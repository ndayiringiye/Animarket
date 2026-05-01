import User from "../../models/users/UserModel.js";
import Otp from "../../models/Otp/otpModel.js"; 
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
import nodemailer from "nodemailer";
import { userRegisterationSchema, userLoginSchema } from "../../validoators/User/UserValidation.js";
import sendOtpByEmail from "../../services/emails/emailServiceOtp.js";
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

        let profile_img = profileImgBody;
        let id_proof_img = idProofBody;
        let shopLogo = shopLogoBody;

        try {
            if (profileFile) {
                const uploaded = await uploadToCloudinary(profileFile, "animarket/users/profile_images");
                profile_img = uploaded.url;
            }

            if (idProofFile) {
                const uploaded = await uploadToCloudinary(idProofFile, "animarket/users/id_proofs");
                id_proof_img = uploaded.url;
            }

            if (shopLogoFile) {
                const uploaded = await uploadToCloudinary(shopLogoFile, "animarket/users/shop_logos");
                shopLogo = uploaded.url;
            }
        } catch (error) {
            return res.status(500).json({ message: "Cloudinary upload failed", error: error.message, status: 500 });
        }

        if (!name || !email || !password || !profile || !gender || !profile_img || !id_Number || !id_proof_img || !category || !shopName || !shopAddress || !shopLogo) {
            return res.status(400).json({ message: "all fields are required", status: 400 });
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
            name, email, phone, password: hashpass, profile, gender, profile_img, id_Number, id_proof_img, category, shopName, shopAddress, shopLogo
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
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.json({ message: "all fields are required", status: 400 });
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
