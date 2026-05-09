import Hotel from "../../models/Hotels/hotelModel.js";
import HotelAnimalBooking from "../../models/Hotels/hotelAnimalBookingModel.js";
import HotelSellerAgreement from "../../models/Hotels/hotelSellerAgreementModel.js";
import Animal from "../../models/animals/AnimalModel.js";
import User from "../../models/users/UserModel.js";
import Meeting from "../../models/Meetings/meettingModels.js";
import QRCode from "qrcode";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import otpGenerator from "otp-generator";
import sendPasswordResetEmail from "../../services/emails/passwordResetEmailService.js";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

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

// Book animal for hotel services
export const bookAnimalForHotel = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const {
      animalId,
      serviceType,
      checkInDate,
      checkOutDate,
      price,
      paymentMethod,
      specialRequests,
    } = req.body;

    // Validate hotel
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({
        message: "Hotel not found",
        status: 404,
      });
    }

    // Validate animal
    const animal = await Animal.findById(animalId).populate("owner");
    if (!animal) {
      return res.status(404).json({
        message: "Animal not found",
        status: 404,
      });
    }

    // Calculate duration
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const duration = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

    if (duration <= 0) {
      return res.status(400).json({
        message: "Check-out date must be after check-in date",
        status: 400,
      });
    }

    // Create booking
    const booking = await HotelAnimalBooking.create({
      hotelId,
      animalId,
      ownerId: animal.owner._id,
      serviceType,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      duration,
      price,
      paymentMethod,
      specialRequests,
      status: "pending",
      paymentStatus: "pending",
    });

    // Generate QR code for payment
    const qrPayload = {
      bookingId: booking._id,
      hotelId: hotel._id,
      animalId: animal._id,
      serviceType,
      amount: price,
      currency: booking.currency,
      status: booking.status,
    };

    const qrCodeUrl = await QRCode.toDataURL(JSON.stringify(qrPayload));

    // Update booking with QR code
    booking.qrCode = {
      qrCodeData: JSON.stringify(qrPayload),
      qrCodeUrl,
      qrCodeGeneratedAt: new Date(),
    };
    await booking.save();

    // Send email to owner
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: animal.owner.email,
      subject: "🐾 Animal Booking Confirmation - AniMarket",
      html: `
        <h2>Booking Confirmed</h2>
        <p><strong>Hotel:</strong> ${hotel.hotelName}</p>
        <p><strong>Animal:</strong> ${animal.name || "Your Pet"}</p>
        <p><strong>Service:</strong> ${serviceType}</p>
        <p><strong>Check-in:</strong> ${checkIn.toDateString()}</p>
        <p><strong>Check-out:</strong> ${checkOut.toDateString()}</p>
        <p><strong>Duration:</strong> ${duration} days</p>
        <p><strong>Amount:</strong> ${price} ${booking.currency}</p>
        <p>Status: ${booking.status}</p>
        <p>Scan QR Code to complete payment:</p>
        <img src="${qrCodeUrl}" alt="QR Code" />
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(201).json({
      message: "Animal booking created successfully",
      status: 201,
      data: booking,
      qrCode: qrCodeUrl,
    });
  } catch (error) {
    console.error("Book animal for hotel error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      status: 500,
    });
  }
};

// Get hotel bookings
export const getHotelBookings = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const { status, page = 1, limit = 10 } = req.query;

    let query = { hotelId };
    if (status) query.status = status;

    const bookings = await HotelAnimalBooking.find(query)
      .populate("animalId", "name type breed")
      .populate("ownerId", "name email phone")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await HotelAnimalBooking.countDocuments(query);

    return res.status(200).json({
      message: "Hotel bookings retrieved successfully",
      status: 200,
      count: bookings.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: bookings,
    });
  } catch (error) {
    console.error("Get hotel bookings error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      status: 500,
    });
  }
};

// Update booking status
export const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status, paymentStatus, notes } = req.body;

    const booking = await HotelAnimalBooking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
        status: 404,
      });
    }

    const updatedBooking = await HotelAnimalBooking.findByIdAndUpdate(
      bookingId,
      { status, paymentStatus, notes },
      { new: true }
    );

    return res.status(200).json({
      message: "Booking updated successfully",
      status: 200,
      data: updatedBooking,
    });
  } catch (error) {
    console.error("Update booking status error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      status: 500,
    });
  }
};

// Rate hotel
export const rateHotel = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const { rating, review, reviewerId } = req.body;

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
        status: 400,
      });
    }

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({
        message: "Hotel not found",
        status: 404,
      });
    }

    // Calculate new average rating
    const currentTotalReviews = hotel.totalReviews;
    const currentTotalRating = hotel.averageRating * currentTotalReviews;
    const newTotalReviews = currentTotalReviews + 1;
    const newAverageRating = (currentTotalRating + rating) / newTotalReviews;

    const updatedHotel = await Hotel.findByIdAndUpdate(
      hotelId,
      {
        averageRating: newAverageRating,
        totalReviews: newTotalReviews,
      },
      { new: true }
    );

    return res.status(200).json({
      message: "Hotel rated successfully",
      status: 200,
      data: {
        hotelId,
        newAverageRating,
        totalReviews: newTotalReviews,
      },
    });
  } catch (error) {
    console.error("Rate hotel error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      status: 500,
    });
  }
};

// Create hotel-seller agreement
export const createHotelSellerAgreement = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const {
      sellerId,
      title,
      description,
      type,
      startDate,
      endDate,
      services,
      financialTerms,
      deliveryTerms,
      cancellationTerms,
      liabilityInsurance,
      disputeResolution,
      confidentialityTerms,
    } = req.body;

    // Validate hotel
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({
        message: "Hotel not found",
        status: 404,
      });
    }

    // Validate seller
    const seller = await User.findById(sellerId);
    if (!seller) {
      return res.status(404).json({
        message: "Seller not found",
        status: 404,
      });
    }

    // Create agreement
    const agreement = await HotelSellerAgreement.create({
      title,
      description,
      type,
      parties: {
        hotel: hotelId,
        seller: sellerId,
      },
      startDate,
      endDate,
      services,
      financialTerms,
      deliveryTerms,
      cancellationTerms,
      liabilityInsurance,
      disputeResolution,
      confidentialityTerms,
      createdBy: hotelId,
      status: "draft",
    });

    return res.status(201).json({
      message: "Hotel-seller agreement created successfully",
      status: 201,
      data: agreement,
    });
  } catch (error) {
    console.error("Create hotel-seller agreement error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      status: 500,
    });
  }
};

// Get hotel-seller agreements
export const getHotelSellerAgreements = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const { status, page = 1, limit = 10 } = req.query;

    let query = { "parties.hotel": hotelId };
    if (status) query.status = status;

    const agreements = await HotelSellerAgreement.find(query)
      .populate("parties.seller", "name email phone")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await HotelSellerAgreement.countDocuments(query);

    return res.status(200).json({
      message: "Hotel-seller agreements retrieved successfully",
      status: 200,
      count: agreements.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: agreements,
    });
  } catch (error) {
    console.error("Get hotel-seller agreements error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      status: 500,
    });
  }
};

// Send agreement to seller
export const sendAgreementToSeller = async (req, res) => {
  try {
    const { agreementId } = req.params;

    const agreement = await HotelSellerAgreement.findById(agreementId)
      .populate("parties.hotel")
      .populate("parties.seller");

    if (!agreement) {
      return res.status(404).json({
        message: "Agreement not found",
        status: 404,
      });
    }

    if (agreement.status !== "draft") {
      return res.status(400).json({
        message: "Only draft agreements can be sent",
        status: 400,
      });
    }

    // Update status
    agreement.status = "sent";
    await agreement.save();

    // Send email to seller
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: agreement.parties.seller.email,
      subject: "📄 Agreement Proposal from Hotel - AniMarket",
      html: `
        <h2>Agreement Proposal</h2>
        <p><strong>Hotel:</strong> ${agreement.parties.hotel.hotelName}</p>
        <p><strong>Title:</strong> ${agreement.title}</p>
        <p><strong>Type:</strong> ${agreement.type}</p>
        <p><strong>Start Date:</strong> ${agreement.startDate.toDateString()}</p>
        <p>Please review and sign the agreement in your dashboard.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      message: "Agreement sent to seller successfully",
      status: 200,
      data: agreement,
    });
  } catch (error) {
    console.error("Send agreement to seller error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      status: 500,
    });
  }
};

// Create hotel meeting
export const createHotelMeeting = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const {
      title,
      description,
      participants,
      meetingType,
      meetingDate,
      durationMinutes,
      provider,
    } = req.body;

    // Validate hotel
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({
        message: "Hotel not found",
        status: 404,
      });
    }

    if (!participants || participants.length === 0) {
      return res.status(400).json({
        message: "Participants required",
        status: 400,
      });
    }

    const validParticipants = [];

    for (const p of participants) {
      let participant = null;

      if (p.type === "user") {
        participant = await User.findById(p.userId);
      } else if (p.type === "hotel") {
        participant = await Hotel.findById(p.userId);
      }

      if (!participant) {
        return res.status(404).json({
          message: `Participant not found: ${p.userId}`,
          status: 404,
        });
      }

      validParticipants.push({
        user: p.userId,
        type: p.type,
        role: p.role,
        status: "invited",
      });
    }

    const meetingUUID = uuidv4();

    const videoCall = {
      provider: provider || "webrtc",
      meetingId: meetingUUID,
      meetingLink:
        provider === "zoom"
          ? `https://zoom.us/j/${meetingUUID}`
          : `${process.env.FRONTEND_URL}/meeting/${meetingUUID}`,
      hostToken: crypto.randomBytes(16).toString("hex"),
      participantToken: crypto.randomBytes(16).toString("hex"),
    };

    const meeting = await Meeting.create({
      title,
      description,
      organizer: hotelId,
      organizerType: "hotel",
      participants: validParticipants,
      meetingType,
      meetingDate,
      durationMinutes: durationMinutes || 30,
      videoCall,
      status: "pending",
    });

    return res.status(201).json({
      message: "Hotel meeting created successfully",
      status: 201,
      data: meeting,
    });
  } catch (error) {
    console.error("Create hotel meeting error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      status: 500,
    });
  }
};
