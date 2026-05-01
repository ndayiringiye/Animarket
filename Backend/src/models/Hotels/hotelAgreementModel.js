import mongoose from "mongoose";

const { Schema } = mongoose;

const HotelAgreementSchema = new Schema(
  {
    // Agreement Details
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, trim: true },
    
    // Agreement Type
    type: {
      type: String,
      enum: [
        "partnership",
        "referral",
        "service_provision",
        "resource_sharing",
        "group_booking",
        "franchise",
        "supply",
        "other",
      ],
      required: true,
      index: true,
    },

    // Parties Involved
    parties: {
      hotelOne: { type: Schema.Types.ObjectId, ref: "Hotel", required: true },
      hotelTwo: { type: Schema.Types.ObjectId, ref: "Hotel", required: true },
    },

    // Agreement Terms
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    renewalDate: { type: Date },
    isAutomaticRenewal: { type: Boolean, default: false },

    // Services/Benefits
    services: [
      {
        serviceName: String,
        description: String,
        terms: String,
        cost: Number,
      },
    ],

    // Financial Terms
    financialTerms: {
      commissionPercentage: { type: Number, min: 0, max: 100 },
      minimumBooking: { type: Number },
      maximumBooking: { type: Number },
      paymentTerms: String, // e.g., "Net 30", "Upon completion"
      currency: { type: String, default: "RWF" },
    },

    // Cancellation Terms
    cancellationTerms: {
      cancellationPeriod: String, // e.g., "30 days notice required"
      penaltyPercentage: { type: Number, min: 0, max: 100 },
      earlyTerminationFee: Number,
    },

    // Liability & Insurance
    liabilityInsurance: {
      required: { type: Boolean, default: false },
      minimumCoverage: Number,
      description: String,
    },

    // Dispute Resolution
    disputeResolution: {
      method: {
        type: String,
        enum: ["mediation", "arbitration", "court"],
        default: "mediation",
      },
      description: String,
    },

    // Confidentiality
    confidentialityTerms: String,
    shareableData: [String], // e.g., ["guest_data", "pricing", "availability"]

    // Agreement Status
    status: {
      type: String,
      enum: [
        "draft",
        "sent",
        "pending_approval",
        "accepted",
        "rejected",
        "active",
        "suspended",
        "terminated",
        "completed",
      ],
      default: "draft",
    },

    // Signatures & Approval
    signatures: {
      hotelOneSignature: String,
      hotelOneSignedAt: Date,
      hotelTwoSignature: String,
      hotelTwoSignedAt: Date,
    },

    // Document Management
    pdfUrl: String,
    pdfPublicId: String,
    attachments: [
      {
        fileName: String,
        fileUrl: String,
        filePublicId: String,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],

    // Admin Management
    createdBy: { type: Schema.Types.ObjectId, ref: "Hotel" },
    approvedBy: { type: Schema.Types.ObjectId, ref: "User" },
    terminatedBy: { type: Schema.Types.ObjectId, ref: "Hotel" },
    terminationReason: String,

    // Communication & Tracking
    emailSent: { type: Boolean, default: false },
    reminderEmailSent: { type: Boolean, default: false },
    lastReminderDate: Date,
    notes: String,

    // Metrics (for tracking agreement performance)
    metrics: {
      totalTransactions: { type: Number, default: 0 },
      totalRevenue: { type: Number, default: 0 },
      totalCommission: { type: Number, default: 0 },
      customerSatisfactionRating: { type: Number, min: 0, max: 5 },
    },

    // Version Control
    version: { type: Number, default: 1 },
    previousVersions: [
      {
        content: String,
        modifiedDate: Date,
        modifiedBy: Schema.Types.ObjectId,
      },
    ],

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Index for faster queries
HotelAgreementSchema.index({ "parties.hotelOne": 1, "parties.hotelTwo": 1 });
HotelAgreementSchema.index({ type: 1, status: 1 });
HotelAgreementSchema.index({ createdAt: -1 });

const HotelAgreement = mongoose.model("HotelAgreement", HotelAgreementSchema);
export default HotelAgreement;
