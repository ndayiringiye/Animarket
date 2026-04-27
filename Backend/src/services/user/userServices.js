import User from "../../models/users/UserModel.js";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
import nodemailer from "nodemailer";
import { userRegisterationSchema, userLoginSchema } from "../../validoators/User/UserValidation.js";
import sendOtpByEmail from "../../services/emails/emailServiceOtp.js";
export const registeringUser = async (req, res) => {
    const { name, email, phone, password, profile, gender, profile_img, id_Number, id_proof_img, category, shopName, shopAddress, shopLogo } = req.body;
    if (!name || !email || !phone || !password || !profile || !gender || !profile_img || !id_Number || !id_proof_img || !category || !shopName || !shopAddress || !shopLogo) {
        return res.json({
            message: "all fields are required",
            status: 400
        })
    };
    const result = userRegisterationSchema.validate(req.body);
    if (result.error) {
        return res.json({
            message: result.error.details[0].message,
            status: 400
        })
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.json({
            message: "user already exists",
            status: 400
        })
    }
    const otpGenerator = otpGenerator.generate(6, {
        lowercaseOtp: false,
        uppercaseOtp: false,
        specialcharacters: false,
        digits: true
    });
    const emailOtp = otpGenerator.generate(6, {
        lowercaseOtp: false,
        uppercaseOtp: false,
        specialcharacters: false,
        digits: true
    });

    const phoneOtp = otpGenerator.generate(6, {
        lowercaseOtp: false,
        uppercaseOtp: false,
        specialcharacters: false,
        digits: true
    });
    const sendeotpemail = await sendOtpByEmail(email, emailOtp);
    if (!sendeotpemail) {
        return res.json({
            message: "OTP sent failed",
            status: 500
        })
    }
    const saveOtp = await Otp.create({
        email: email,
        emailOtp: emailOtp,
        phone: phone,
        phoneOtp: phoneOtp,
    })

    const saltValue = await bcrypt.genSalt(10);
    const hashpass = await bcrypt.hash(password, saltValue);
    if (!hashpass) {
        return res.json({
            message: "password hashing failed",
            status: 500
        })
    }
    const saveUser = await User.create({
        name,
        email,
        phone,
        password: hashpass,
        profile,
        gender,
        profile_img,
        id_Number,
        id_proof_img,
        category,
        shopName,
        shopAddress,
        shopLogo
    })
    if (saveUser) {
        try {
            return res.json({
                message: "user registered successfully",
                data: saveUser,
                status: 200
            })
        } catch (error) {
            return res.json({
                message: "user registration failed",
                error: error.message,
                status: 500
            })
        }
    }




}

export const LoginUser = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.json({
            message: "all fields are required",
            status: 400
        })
    };
    const result = userLoginSchema.validate(req.body);
    if (result.error) {
        return res.json({
            message: result.error.details[0].message,
            status: 400
        })
    }
    const userExists = await User.findOne({ email });
    if (!userExists) {
        return res.json({
            message: "user not found",
            status: 404
        })
    }
    const comparepass = await bcrypt.compare(password, userExists.password);
    if (comparepass) {
        const token = jwt.sign({ id: userExists._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        return res.json({
            message: "password is correct",
            status: 200,
            token,
            user: userExists
        })
    } else {
        return res.json({
            message: "invalid password",
            status: 401
        })
    }
    try {
        return res.json({
            message: "login success",
            data: userExists,
            status: 200,
            token: token
        })
    } catch (error) {
        return res.json({
            message: "login failed",
            error: error.message,
            status: 500
        })
    }
}


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
