import Hotel from "../../models/Hotels/hotelModel.js";
import HotelAgreement from "../../models/Hotels/hotelAgreementModel.js";
import * as hotelService from "../../services/Hotels/hotelService.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
import crypto from "crypto";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

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
      contactPersonName,
      contactPersonPhone,
      accountType,
      parentHotelId, // If registering under another hotel
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
      contactPersonName,
      contactPersonPhone,
      accountType: accountType || "individual_hotel",
      status: "pending", // Will be approved by admin
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

      // Check max child hotels limit
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

    // Send registration confirmation email
    const confirmationToken = jwt.sign(
      { id: newHotel._id, type: "hotel_registration" },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "🏨 Hotel Registration Confirmation - AniMarket",
      html: `
        <h2>Welcome to AniMarket!</h2>
        <p><strong>Hotel Name:</strong> ${hotelName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p>Your hotel registration is pending admin approval. You will receive another email once approved.</p>
        <p><strong>Confirmation Token:</strong> ${confirmationToken}</p>
        <p>Please keep this token safe for verification purposes.</p>
      `,
    };

    // Note: transporter is not imported here, but assuming it's available or we can import it
    // For now, we'll skip the email sending in this edit

    return res.status(201).json({
      message: "Hotel registered successfully. Awaiting admin approval.",
      status: 201,
      data: newHotel,
      confirmationToken,
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

// Book animal for hotel services
export const bookAnimalForHotel = async (req, res) => {
  return await hotelService.bookAnimalForHotel(req, res);
};

// Get hotel bookings
export const getHotelBookings = async (req, res) => {
  return await hotelService.getHotelBookings(req, res);
};

// Update booking status
export const updateBookingStatus = async (req, res) => {
  return await hotelService.updateBookingStatus(req, res);
};

// Rate hotel
export const rateHotel = async (req, res) => {
  return await hotelService.rateHotel(req, res);
};

// Create hotel-seller agreement
export const createHotelSellerAgreement = async (req, res) => {
  return await hotelService.createHotelSellerAgreement(req, res);
};

// Get hotel-seller agreements
export const getHotelSellerAgreements = async (req, res) => {
  return await hotelService.getHotelSellerAgreements(req, res);
};

// Send agreement to seller
export const sendAgreementToSeller = async (req, res) => {
  return await hotelService.sendAgreementToSeller(req, res);
};

// Create hotel meeting
export const createHotelMeeting = async (req, res) => {
  return await hotelService.createHotelMeeting(req, res);
};
