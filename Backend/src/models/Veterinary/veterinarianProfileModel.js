import mongoose from "mongoose";

const VeterinarianProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    licenseNumber: {
      type: String,
      required: true,
      unique: true,
    },

    licenseIssueDate: Date,
    licenseExpiryDate: Date,

    licenseDocument: {
      url: String,
      publicId: String,
    },

    specializations: [String],

    yearsOfExperience: Number,

    education: [
      {
        institution: String,
        degree: String,
        field: String,
        graduationYear: Number,
      },
    ],

    certifications: [
      {
        name: String,
        issuingBody: String,
        issueDate: Date,
        expiryDate: Date,
        certificateUrl: String,
        publicId: String,
      },
    ],

    languages: [String],

    about: String,

    profileImage: {
      url: String,
      publicId: String,
    },

    location: {
      address: String,
      city: String,
      country: String,
      latitude: Number,
      longitude: Number,
    },

    availability: {
      isAvailable: Boolean,
      availableHoursPerWeek: Number,
      timezone: String,
    },

    consultation: {
      offersRemoteConsultation: Boolean,
      offersOnSiteVisit: Boolean,
      hourlyRate: Number,
      currency: { type: String, default: "RWF" },
    },

    reputation: {
      averageRating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
      },

      totalRatings: {
        type: Number,
        default: 0,
      },

      totalCompletedJobs: {
        type: Number,
        default: 0,
      },

      responseTimeHours: Number,

      clientSatisfactionRate: Number,
    },

    bankDetails: {
      bankName: String,
      accountHolderName: String,
      accountNumber: String,
      swiftCode: String,
      ibanNumber: String,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    verificationDocument: {
      url: String,
      publicId: String,
    },

    backgroundCheckStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    backgroundCheckDocument: {
      url: String,
      publicId: String,
    },

    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },

    jobPostingsApplied: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "VeterinaryJobPosting",
      },
    ],

    applicationsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Keep ONLY non-duplicate indexes
VeterinarianProfileSchema.index({ specializations: 1 });
VeterinarianProfileSchema.index({ "reputation.averageRating": -1 });

// FIXED nested location index
VeterinarianProfileSchema.index({
  "location.city": 1,
  "location.country": 1,
});

const VeterinarianProfile = mongoose.model(
  "VeterinarianProfile",
  VeterinarianProfileSchema
);

export default VeterinarianProfile;