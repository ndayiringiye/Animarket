import User from "../../models/users/UserModel.js"
import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies?.token || 
                     (req.headers.authorization && req.headers.authorization.split(" ")[1]);

        if (!token) {
            return res.status(401).json({ message: "No token found", status: 401 });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decodedToken.id);
        
        if (!req.user) {
            return res.status(401).json({ message: "User not found" });
        }

        next();
    } catch (error) {
        console.error("Auth error:", error.message);
        return res.status(401).json({
            message: "Invalid or expired token",
            error: error.message
        });
    }
};
export default authMiddleware;
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