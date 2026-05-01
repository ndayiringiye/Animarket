import mongoose from "mongoose";

const HotelSchema = new mongoose.Schema(
  {
    // Basic Information
    hotelName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    registrationNumber: { type: String, required: true, unique: true },

    // Branding & Images
    logo: { type: String },
    logo_public_id: { type: String },
    coverImage: { type: String },
    coverImage_public_id: { type: String },
    profileImage: { type: String },
    profileImage_public_id: { type: String },

    // Location & Address
    country: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
    zipCode: { type: String },
    latitude: { type: Number },
    longitude: { type: Number },

    // Hotel Details
    hotelType: {
      type: String,
      enum: ["boutique", "luxury", "budget", "mid-range", "resort", "hostel", "other"],
      required: true,
    },
    starRating: { type: Number, min: 1, max: 5 },
    numberOfRooms: { type: Number },
    amenities: [String], // e.g., ["WiFi", "Pool", "Restaurant", "Parking"]

    // Contact Information
    contactPersonName: { type: String },
    contactPersonPhone: { type: String },
    contactPersonEmail: { type: String },
    website: { type: String },

    // Verification & Status
    isVerified: { type: Boolean, default: false },
    verificationDocuments: [
      {
        documentType: String, // e.g., "registration_certificate", "tax_id", "business_license"
        documentUrl: String,
        documentPublicId: String,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "active", "inactive", "suspended"],
      default: "pending",
    },

    // Account Management
    accountType: {
      type: String,
      enum: ["individual_hotel", "hotel_chain", "hotel_group"],
      default: "individual_hotel",
    },

    // Parent Hotel (if registered by another hotel)
    parentHotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      default: null,
    },

    // Child Hotels (if this hotel registers other hotels)
    childHotels: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hotel",
      },
    ],

    // Hotel Permissions & Settings
    canRegisterOtherHotels: { type: Boolean, default: false },
    canMakeAgreements: { type: Boolean, default: true },
    maxChildHotelsAllowed: { type: Number, default: 0 },

    // Agreements
    agreements: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "HotelAgreement",
      },
    ],

    // Payment Information
    bankName: { type: String },
    accountHolderName: { type: String },
    accountNumber: { type: String },
    swiftCode: { type: String },
    paymentMethodsAccepted: [
      {
        type: String,
        enum: ["bank_transfer", "mobile_money", "card", "cash", "check"],
      },
    ],

    // Business Information
    annualRevenue: { type: Number },
    taxID: { type: String },
    businessLicense: { type: String },
    businessLicensePublicId: { type: String },

    // Rating & Reviews
    averageRating: { type: Number, min: 0, max: 5, default: 0 },
    totalReviews: { type: Number, default: 0 },
    totalBookings: { type: Number, default: 0 },

    // Admin Notes
    adminNotes: { type: String },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // Password Reset
    resetToken: { type: String, default: null },
    resetTokenExpiry: { type: Date, default: null },
    resetOTP: { type: String, default: null },
    resetOTPExpiry: { type: Date, default: null },

    // Activity Tracking
    lastLogin: { type: Date },
    isActive: { type: Boolean, default: true },
    suspensionReason: { type: String },
    suspensionDate: { type: Date },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Index for faster queries
HotelSchema.index({ hotelName: 1 });
HotelSchema.index({ status: 1 });
HotelSchema.index({ parentHotel: 1 });
HotelSchema.index({ country: 1, city: 1 });

const Hotel = mongoose.model("Hotel", HotelSchema);
export default Hotel;
