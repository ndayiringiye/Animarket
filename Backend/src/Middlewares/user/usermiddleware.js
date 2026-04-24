import User from "../../models/users/UserModel.js"
import jwt from "jsonwebtoken";

const authMiddleware = async(req,res,next)=>{
    try {
        const token = req.cookies.token || req.headers.authorization.split(" ")[1];
        if(!token){
            return res.json({
                message:"No token found",
                status:401
            })
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decodedToken.id);
        next();
    } catch (error) {
        return res.json({
            message:"Invalid token",
            status:401
        })
    }
}

export const isVerified = async(req,res,next)=>{
    try {
        const {isVerified} = req.user;
        if(isVerified){
            return res.json({
                message:"You are verified",
                status:200
            })
        }
        next();
    } catch (error) {
        return res.json({
            message:"Internal server error",
            status:500
        })
    }
}