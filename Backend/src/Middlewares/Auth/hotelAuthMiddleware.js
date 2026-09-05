import jwt from "jsonwebtoken";
import Hotel from "../../models/Hotels/hotelModel.js";

export const verifyHotelToken = async (req, res, next) => {
  try {
    const token = req.headers?.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Access denied. No hotel token provided.",
        status: 401,
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const hotel = await Hotel.findById(decoded.id).select("-password");

    if (!hotel) {
      return res.status(401).json({
        message: "Hotel not found.",
        status: 401,
      });
    }

    req.hotel = hotel;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired hotel token",
      error: error.message,
      status: 401,
    });
  }
};