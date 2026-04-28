import jwt from "jsonwebtoken";
import User from "../../models/users/UserModel.js";

export const verifyToken = async (req, res, next) => {
    try {
        // Get token from cookies OR Authorization header
        const token =
            req.cookies?.token ||
            req.headers?.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                message: "Access denied. No token provided."
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user to request
        req.user = await User.findById(decoded.id).select("-password");

        if (!req.user) {
            return res.status(401).json({
                message: "User not found."
            });
        }

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token",
            error: error.message
        });
    }
};