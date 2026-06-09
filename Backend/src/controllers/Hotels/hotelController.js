import Hotel from "../../models/Hotels/hotelModel.js";
import HotelAgreement from "../../models/Hotels/hotelAgreementModel.js";
import * as hotelService from "../../services/Hotels/hotelService.js";
import { uploadToCloudinary } from "../../services/upload/mediaService.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

// Register a new hotel
export const registerHotel = async (req, res) => {
  try {
    const {
      hotelName,
      email,
      phone,
      password,
      confirmPassword,
      registrationNumber,
      hotelType,
      country,
      city,
      address,
      zipCode,
      contactPersonName,
      contactPersonPhone,
      contactPersonEmail,
      website,
      accountType,
      parentHotelId,
    } = req.body;

    // Validation
    if (!hotelName || !email || !phone || !password || !registrationNumber || !hotelType || !country || !city || !address) {
      return res.status(400).json({
        message: "All required fields must be provided",
        status: 400,
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
        status: 400,
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
        status: 400,
      });
    }

    // Check if email already exists
    const existingHotel = await Hotel.findOne({ email });
    if (existingHotel) {
      return res.status(400).json({
        message: "Hotel with this email already exists",
        status: 400,
      });
    }

    // Check if registration number already exists
    const registrationExists = await Hotel.findOne({ registrationNumber });
    if (registrationExists) {
      return res.status(400).json({
        message: "Hotel with this registration number already exists",
        status: 400,
      });
    }

    // Handle file uploads
    let logo = null, logo_public_id = null;
    let coverImage = null, coverImage_public_id = null;
    let profileImage = null, profileImage_public_id = null;

    if (req.files?.logo?.[0]) {
      const uploaded = await uploadToCloudinary(req.files.logo[0], "animarket/hotels/logos");
      logo = uploaded.url;
      logo_public_id = uploaded.public_id;
    }

    if (req.files?.coverImage?.[0]) {
      const uploaded = await uploadToCloudinary(req.files.coverImage[0], "animarket/hotels/cover_images");
      coverImage = uploaded.url;
      coverImage_public_id = uploaded.public_id;
    }

    if (req.files?.profileImage?.[0]) {
      const uploaded = await uploadToCloudinary(req.files.profileImage[0], "animarket/hotels/profile_images");
      profileImage = uploaded.url;
      profileImage_public_id = uploaded.public_id;
    }

    let parentHotel = null;
    let hotelObject = {
      hotelName,
      email,
      phone,
      registrationNumber,
      hotelType,
      country,
      city,
      address,
      zipCode: zipCode || null,
      contactPersonName,
      contactPersonPhone,
      contactPersonEmail,
      website: website || null,
      accountType: accountType || "individual_hotel",
      status: "pending",
      logo,
      logo_public_id,
      coverImage,
      coverImage_public_id,
      profileImage,
      profileImage_public_id,
    };

    // If registering under another hotel
    if (parentHotelId) {
      parentHotel = await Hotel.findById(parentHotelId);
      if (!parentHotel) {
        return res.status(404).json({
          message: "Parent hotel not found",
          status: 404,
        });
      }

      if (!parentHotel.canRegisterOtherHotels) {
        return res.status(403).json({
          message: "This parent hotel is not authorized to register other hotels",
          status: 403,
        });
      }

      if (parentHotel.childHotels.length >= parentHotel.maxChildHotelsAllowed) {
        return res.status(400).json({
          message: `Parent hotel has reached maximum child hotels limit (${parentHotel.maxChildHotelsAllowed})`,
          status: 400,
        });
      }

      hotelObject.parentHotel = parentHotelId;
    }

    // Hash password
    const saltValue = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, saltValue);
    hotelObject.password = hashedPassword;

    // Create hotel
    const newHotel = await Hotel.create(hotelObject);

    // Add to parent's child hotels if applicable
    if (parentHotelId) {
      await Hotel.findByIdAndUpdate(
        parentHotelId,
        { $push: { childHotels: newHotel._id } },
        { new: true }
      );
    }

    return res.status(201).json({
      message: "Hotel registered successfully. Awaiting admin approval.",
      status: 201,
      data: newHotel,
    });
  } catch (error) {
    console.error("Hotel registration error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      status: 500,
    });
  }
};

// Hotel login
export const hotelLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
        status: 400,
      });
    }

    const hotel = await Hotel.findOne({ email });
    if (!hotel) {
      return res.status(404).json({
        message: "Hotel not found",
        status: 404,
      });
    }

    if (hotel.status === "suspended" || hotel.status === "inactive") {
      return res.status(403).json({
        message: `Hotel account is ${hotel.status}`,
        status: 403,
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, hotel.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid password",
        status: 401,
      });
    }

    const token = jwt.sign(
      { id: hotel._id, type: "hotel" },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Update last login
    await Hotel.findByIdAndUpdate(hotel._id, { lastLogin: new Date() });

    return res.status(200).json({
      message: "Login successful",
      status: 200,
      token,
      data: hotel,
    });
  } catch (error) {
    console.error("Hotel login error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      status: 500,
    });
  }
};

// Get hotel profile
export const getHotelProfile = async (req, res) => {
  try {
    const { hotelId } = req.params;

    const hotel = await Hotel.findById(hotelId)
      .populate("parentHotel", "hotelName email")
      .populate("childHotels", "hotelName email status")
      .populate("agreements", "title type status");

    if (!hotel) {
      return res.status(404).json({
        message: "Hotel not found",
        status: 404,
      });
    }

    return res.status(200).json({
      message: "Hotel profile retrieved successfully",
      status: 200,
      data: hotel,
    });
  } catch (error) {
    console.error("Get hotel profile error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      status: 500,
    });
  }
};

// Update hotel profile
export const updateHotelProfile = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const updates = req.body;

    // Prevent updating certain fields
    delete updates.email;
    delete updates.registrationNumber;
    delete updates.password;

    const updatedHotel = await Hotel.findByIdAndUpdate(hotelId, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedHotel) {
      return res.status(404).json({
        message: "Hotel not found",
        status: 404,
      });
    }

    return res.status(200).json({
      message: "Hotel profile updated successfully",
      status: 200,
      data: updatedHotel,
    });
  } catch (error) {
    console.error("Update hotel profile error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      status: 500,
    });
  }
};

// Get all child hotels
export const getChildHotels = async (req, res) => {
  try {
    const { hotelId } = req.params;

    const hotel = await Hotel.findById(hotelId).populate("childHotels");

    if (!hotel) {
      return res.status(404).json({
        message: "Hotel not found",
        status: 404,
      });
    }

    return res.status(200).json({
      message: "Child hotels retrieved successfully",
      status: 200,
      count: hotel.childHotels.length,
      data: hotel.childHotels,
    });
  } catch (error) {
    console.error("Get child hotels error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      status: 500,
    });
  }
};

// Enable hotel to register other hotels (Admin only)
export const authorizeHotelRegistration = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const { maxChildHotels } = req.body;

    if (!maxChildHotels || maxChildHotels <= 0) {
      return res.status(400).json({
        message: "maxChildHotels must be greater than 0",
        status: 400,
      });
    }

    const updatedHotel = await Hotel.findByIdAndUpdate(
      hotelId,
      {
        canRegisterOtherHotels: true,
        maxChildHotelsAllowed: maxChildHotels,
      },
      { new: true }
    );

    if (!updatedHotel) {
      return res.status(404).json({
        message: "Hotel not found",
        status: 404,
      });
    }

    return res.status(200).json({
      message: "Hotel authorized to register other hotels",
      status: 200,
      data: updatedHotel,
    });
  } catch (error) {
    console.error("Authorize hotel registration error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      status: 500,
    });
  }
};

// Get all hotels (Admin only)
export const getAllHotels = async (req, res) => {
  return hotelService.getAllHotels(req, res);
};

export const approveHotel = async (req, res) => {
  return hotelService.approveHotel(req, res);
};

// Book animal for hotel services
export const bookAnimalForHotel = async (req, res) => {
  return hotelService.bookAnimalForHotel(req, res);
};

// Get hotel bookings
export const getHotelBookings = async (req, res) => {
  return hotelService.getHotelBookings(req, res);
};

// Update booking status
export const updateBookingStatus = async (req, res) => {
  return hotelService.updateBookingStatus(req, res);
};

// Rate hotel
export const rateHotel = async (req, res) => {
  return hotelService.rateHotel(req, res);
};

// Get hotel statistics
export const getHotelStatistics = async (req, res) => {
  return hotelService.getHotelStatistics(req, res);
};

// Search hotels
export const searchHotels = async (req, res) => {
  return hotelService.searchHotels(req, res);
};

// Password reset flow
export const hotelForgotPassword = async (req, res) => {
  return hotelService.hotelForgotPassword(req, res);
};

export const hotelVerifyResetOTP = async (req, res) => {
  return hotelService.hotelVerifyResetOTP(req, res);
};

export const hotelConfirmResetPassword = async (req, res) => {
  return hotelService.hotelConfirmResetPassword(req, res);
};

// Get hotel-seller agreements
export const getHotelSellerAgreements = async (req, res) => {
  return hotelService.getHotelSellerAgreements(req, res);
};

// Send agreement to seller
export const sendAgreementToSeller = async (req, res) => {
  return hotelService.sendAgreementToSeller(req, res);
};

// Agreement & Meeting functions (add your original logic or delegate)
export const createHotelAgreement = async (req, res) => { /* your logic */ };
export const createHotelSellerAgreement = async (req, res) => { /* your logic */ };
export const createHotelMeeting = async (req, res) => { /* your logic */ };

export default {
  registerHotel,
  hotelLogin,
  getHotelProfile,
  updateHotelProfile,
  getChildHotels,
  authorizeHotelRegistration,
  getAllHotels,
  approveHotel,
  bookAnimalForHotel,
  getHotelBookings,
  updateBookingStatus,
  rateHotel,
  getHotelStatistics,
  searchHotels,
  hotelForgotPassword,
  hotelVerifyResetOTP,
  hotelConfirmResetPassword,
  getHotelSellerAgreements,
  sendAgreementToSeller,
  createHotelAgreement,
  createHotelSellerAgreement,
  createHotelMeeting,
};
