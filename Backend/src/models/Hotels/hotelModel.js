// models/Hotels/hotelModel.js
import mongoose from "mongoose";

const HotelSchema = new mongoose.Schema(
  {
    hotelName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    registrationNumber: { type: String, required: true, unique: true },

    logo: String,
    logo_public_id: String,
    coverImage: String,
    coverImage_public_id: String,
    profileImage: String,
    profileImage_public_id: String,

    country: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
    zipCode: String,
    latitude: Number,
    longitude: Number,

    hotelType: {
      type: String,
      enum: ["boutique", "luxury", "budget", "mid-range", "resort", "hostel", "other"],
      required: true,
    },
    starRating: { type: Number, min: 1, max: 5 },
    numberOfRooms: Number,
    amenities: [String],

    contactPersonName: String,
    contactPersonPhone: String,
    contactPersonEmail: String,
    website: String,

    isVerified: { type: Boolean, default: false },
    verificationDocuments: [{
      documentType: String,
      documentUrl: String,
      documentPublicId: String,
      uploadedAt: { type: Date, default: Date.now },
    }],
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "active", "inactive", "suspended"],
      default: "pending",
    },

    accountType: {
      type: String,
      enum: ["individual_hotel", "hotel_chain", "hotel_group"],
      default: "individual_hotel",
    },

    parentHotel: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel", default: null },
    childHotels: [{ type: mongoose.Schema.Types.ObjectId, ref: "Hotel" }],

    canRegisterOtherHotels: { type: Boolean, default: false },
    canMakeAgreements: { type: Boolean, default: true },
    maxChildHotelsAllowed: { type: Number, default: 0 },

    agreements: [{ type: mongoose.Schema.Types.ObjectId, ref: "HotelAgreement" }],

    walletBalance: { type: Number, default: 0 },

    bankName: String,
    accountHolderName: String,
    accountNumber: String,
    swiftCode: String,
    paymentMethodsAccepted: [String],

    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    totalBookings: { type: Number, default: 0 },

    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    adminNotes: String,

    resetToken: String,
    resetTokenExpiry: Date,
    resetOTP: String,
    resetOTPExpiry: Date,

    lastLogin: Date,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

HotelSchema.index({ hotelName: 1 });
HotelSchema.index({ status: 1 });
HotelSchema.index({ parentHotel: 1 });

const Hotel = mongoose.model("Hotel", HotelSchema);
export default Hotel;