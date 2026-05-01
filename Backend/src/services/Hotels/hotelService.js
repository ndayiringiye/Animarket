import Hotel from "../../models/Hotels/hotelModel.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import otpGenerator from "otp-generator";
import sendPasswordResetEmail from "../../services/emails/passwordResetEmailService.js";

// Hotel Forgot Password
export const hotelForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
        status: 400,
      });
    }

    const hotel = await Hotel.findOne({ email });
    if (!hotel) {
      return res.status(404).json({
        message: "Hotel not found with this email",
        status: 404,
      });
    }

    // Generate 6-digit OTP
    const resetOTP = otpGenerator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
      digits: true,
    });

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Set expiry times
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    const resetOTPExpiry = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    // Save to hotel
    await Hotel.findByIdAndUpdate(hotel._id, {
      resetOTP: resetOTP,
      resetOTPExpiry: resetOTPExpiry,
      resetToken: hashedResetToken,
      resetTokenExpiry: resetTokenExpiry,
    });

    // Send email (reusing the existing password reset email service)
    const emailSent = await sendPasswordResetEmail(email, resetOTP, resetToken);
    if (!emailSent) {
      return res.status(500).json({
        message: "Failed to send password reset email",
        status: 500,
      });
    }

    return res.status(200).json({
      message: "Password reset email sent successfully",
      status: 200,
      email: email,
    });
  } catch (error) {
    console.error("Hotel forgot password error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      status: 500,
    });
  }
};

// Hotel Verify Reset OTP
export const hotelVerifyResetOTP = async (req, res) => {
  try {
    const { email, resetOTP } = req.body;

    if (!email || !resetOTP) {
      return res.status(400).json({
        message: "Email and OTP are required",
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

    if (!hotel.resetOTP || !hotel.resetOTPExpiry) {
      return res.status(400).json({
        message: "No password reset request found",
        status: 400,
      });
    }

    if (new Date() > hotel.resetOTPExpiry) {
      await Hotel.findByIdAndUpdate(hotel._id, {
        resetOTP: null,
        resetOTPExpiry: null,
      });
      return res.status(400).json({
        message: "OTP has expired. Please request a new password reset",
        status: 400,
      });
    }

    if (hotel.resetOTP !== resetOTP) {
      return res.status(401).json({
        message: "Invalid OTP",
        status: 401,
      });
    }

    return res.status(200).json({
      message: "OTP verified successfully",
      status: 200,
      verified: true,
    });
  } catch (error) {
    console.error("Hotel verify OTP error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      status: 500,
    });
  }
};

// Hotel Confirm Reset Password
export const hotelConfirmResetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword, confirmPassword } = req.body;

    if (!resetToken || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message: "resetToken, newPassword, and confirmPassword are required",
        status: 400,
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
        status: 400,
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
        status: 400,
      });
    }

    const hashedResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const hotel = await Hotel.findOne({
      resetToken: hashedResetToken,
      resetTokenExpiry: { $gt: new Date() },
    });

    if (!hotel) {
      return res.status(400).json({
        message: "Invalid or expired reset token",
        status: 400,
      });
    }

    const saltValue = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, saltValue);

    const updatedHotel = await Hotel.findByIdAndUpdate(
      hotel._id,
      {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
        resetOTP: null,
        resetOTPExpiry: null,
      },
      { new: true }
    );

    return res.status(200).json({
      message: "Password reset successfully",
      status: 200,
      data: updatedHotel,
    });
  } catch (error) {
    console.error("Hotel confirm reset password error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      status: 500,
    });
  }
};

// Get hotel statistics
export const getHotelStatistics = async (req, res) => {
  try {
    const { hotelId } = req.params;

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({
        message: "Hotel not found",
        status: 404,
      });
    }

    const statistics = {
      hotelName: hotel.hotelName,
      totalBookings: hotel.totalBookings,
      averageRating: hotel.averageRating,
      totalReviews: hotel.totalReviews,
      childHotelsCount: hotel.childHotels.length,
      activeAgreements: await Hotel.countDocuments({
        agreements: { $exists: true },
      }),
      status: hotel.status,
      accountType: hotel.accountType,
    };

    return res.status(200).json({
      message: "Hotel statistics retrieved successfully",
      status: 200,
      data: statistics,
    });
  } catch (error) {
    console.error("Get hotel statistics error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      status: 500,
    });
  }
};

// Search hotels
export const searchHotels = async (req, res) => {
  try {
    const { keyword, country, city, hotelType, status } = req.query;
    let searchQuery = { status: "approved" };

    if (keyword) {
      searchQuery.$or = [
        { hotelName: { $regex: keyword, $options: "i" } },
        { city: { $regex: keyword, $options: "i" } },
      ];
    }

    if (country) searchQuery.country = country;
    if (city) searchQuery.city = city;
    if (hotelType) searchQuery.hotelType = hotelType;
    if (status) searchQuery.status = status;

    const hotels = await Hotel.find(searchQuery)
      .select("hotelName city country hotelType starRating amenities averageRating totalReviews")
      .limit(20);

    return res.status(200).json({
      message: "Hotels found",
      status: 200,
      count: hotels.length,
      data: hotels,
    });
  } catch (error) {
    console.error("Search hotels error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      status: 500,
    });
  }
};

// Get all hotels (Admin only)
export const getAllHotels = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const query = status ? { status } : {};

    const hotels = await Hotel.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Hotel.countDocuments(query);

    return res.status(200).json({
      message: "All hotels retrieved successfully",
      status: 200,
      count: hotels.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: hotels,
    });
  } catch (error) {
    console.error("Get all hotels error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      status: 500,
    });
  }
};

// Approve/Reject hotel registration (Admin only)
export const approveHotel = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const { approvalStatus, adminNotes } = req.body;

    if (!["approved", "rejected"].includes(approvalStatus)) {
      return res.status(400).json({
        message: "approvalStatus must be 'approved' or 'rejected'",
        status: 400,
      });
    }

    const updatedHotel = await Hotel.findByIdAndUpdate(
      hotelId,
      {
        status: approvalStatus === "approved" ? "active" : "rejected",
        adminNotes: adminNotes,
        approvedBy: req.user?.id, // Assuming user ID from auth middleware
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
      message: `Hotel ${approvalStatus} successfully`,
      status: 200,
      data: updatedHotel,
    });
  } catch (error) {
    console.error("Approve hotel error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      status: 500,
    });
  }
};
