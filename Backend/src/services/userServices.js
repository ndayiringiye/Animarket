import User from "../models/users/UserModel.js";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt"
export const registeringUser = async (req, res) => {
    const { name, email, phone, password, profile, category, shopName, shopAddress, shopLogo } = req.body;
    if (!name || !email || !phone || !password || !profile || !category || !shopName || !shopAddress || !shopLogo) {
        return res.json({
            message: "all fields are required",
            status: 400
        })
    };
    const userExists = await User.find(email);
    if (userExists.length > 0) {
        return res.json({
            message: "user already exists",
            status: 400
        })
    }
    const comparepass = await bcrypt.compare(password, existsUser.password);
    if (comparepass) {
        return res.json({
            message: "password is correct",
            status: 200
        })
    }
    const hashpass = await bcrypt.hash(password, salt(10));
    if (!hashpass) {
        return res.json({
            message: "password hashing failed",
            status: 500
        })
    }
    if (!salt) {
        return res.json({
            message: "salt generation failed",
            status: 500
        })
    }
    const saveUser = await User.create({
        name,
        email,
        phone,
        password: hashpass,
        profile,
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

    await saveUser();


}

export const LoginUser =  async (req,  res) => {
    const {name ,  email, password} =  req.body;
    if(!name || !email || !password){
        return res.json({
            message: "all fields are required",
            status: 400
        })
    };
    const userExists = await User.find(email);
    if(userExists.length > 0){
        return res.json({
            message: "user already exists",
            status: 400
        })
    }
    const comparepass = await bcrypt.compare(password, existsUser.password);
    if(comparepass){
        return res.json({
            message: "password is correct",
            status: 200
        })
    }
}


export const getAlluser = async (res, req) => {
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

export const getoneUser = async (res, req) => {
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
    const user = await User.findByIdAndUpdate(id, { role }, new: true);
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
