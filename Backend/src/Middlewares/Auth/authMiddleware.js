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
        if (decoded.type === "hotel") {
            const Hotel = (await import("../../models/Hotels/hotelModel.js")).default;
            const hotel = await Hotel.findById(decoded.id).select("-password");
            if (!hotel) {
                return res.status(401).json({
                    message: "Hotel not found."
                });
            }
            req.user = { ...hotel.toObject(), role: "hotel" };
        } else {
            req.user = await User.findById(decoded.id).select("-password");
            if (!req.user) {
                return res.status(401).json({
                    message: "User not found."
                });
            }
            User.findByIdAndUpdate(req.user._id, { lastSeen: new Date() }).exec().catch(() => {});
        }

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token",
            error: error.message
        });
    }
};

export const authenticateUser = async (req, res, next) => {
  try {
    // req.userId must be set by verifyToken
    if (!req.userId) {
      return res.status(401).json({
        message: "Unauthorized. No user ID found."
      });
    }

    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User not found."
      });
    }

    // attach full user object
    req.user = user;

    next();

  } catch (error) {
    return res.status(500).json({
      message: "Authentication failed",
      error: error.message
    });
  }
};
