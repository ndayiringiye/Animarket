import mongoose from "mongoose";

const VeterinaryAgreementSchema = new mongoose.Schema(
  {
    // Agreement Title
    title: { type: String, required: true, trim: true },
    description: String,

    // Service Job Reference
    serviceJob: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VeterinaryServiceJob",
      required: true,
    },

    // Parties Involved
    veterinarian: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    veterinarianName: String,
    veterinarianLicense: String,

    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    clientRole: {
      type: String,
      enum: ["farmer", "seller", "customer"],
      required: true,
    },
    clientName: String,

    // Animal Information
    animal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Animal",
      required: true,
    },
    animalName: String,
    animalType: String,

    // Service Details
    serviceType: {
      type: String,
      enum: [
        "vaccination",
        "checkup",
        "treatment",
        "consultation",
        "emergency",
        "follow_up",
        "surgery",
        "health_certificate",
      ],
      required: true,
    },

    // Medical Details
    diagnosis: String,
    treatmentPlan: String,
    medications: [
      {
        medicationName: String,
        dosage: String,
        frequency: String,
        duration: String,
      },
    ],

    // Vaccination Details (if applicable)
    vaccinationDetails: {
      vaccineName: String,
      vaccineBatch: String,
      vaccinationDate: Date,
      nextVaccinationDate: Date,
      vaccinationCertificate: String,
      vaccinationCertificatePublicId: String,
    },

    // Health Certificate
    healthCertificate: {
      certificateNumber: String,
      issuedDate: Date,
      expiryDate: Date,
      certificateUrl: String,
      certificatePublicId: String,
      healthStatus: {
        type: String,
        enum: ["healthy", "treated", "monitored", "requires_care"],
      },
    },

    // Pricing & Payment
    serviceCost: { type: Number, required: true },
    currency: { type: String, default: "RWF" },

    paymentTerms: {
      paymentMethod: {
        type: String,
        enum: ["bank_transfer", "mobile_money", "cash", "card"],
        required: true,
      },
      paymentSchedule: String, // e.g., "Full payment before service", "50% now, 50% after"
      dueDate: Date,
      paidAmount: { type: Number, default: 0 },
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "partial", "paid", "overdue"],
      default: "pending",
    },

    paymentHistory: [
      {
        amount: Number,
        paymentMethod: String,
        paymentDate: Date,
        transactionId: String,
        notes: String,
      },
    ],

    // Follow-up Care
    followUpRequired: { type: Boolean, default: false },
    followUpSchedule: String,
    followUpDate: Date,

    // Agreement Status
    status: {
      type: String,
      enum: [
        "draft",
        "sent",
        "pending_signature",
        "signed",
        "active",
        "completed",
        "terminated",
      ],
      default: "draft",
      index: true,
    },

    // Digital Signatures
    signatures: {
      veterinarianSignature: String,
      veterinarianSignedAt: Date,
      clientSignature: String,
      clientSignedAt: Date,
    },

    // QR Code & Certificate
    qrCode: {
      qrCodeData: String,
      qrCodeUrl: String,
      qrCodePublicId: String,
      qrCodeGeneratedAt: Date,
    },

    // Proof of Service
    proofImages: [
      {
        imageUrl: String,
        imagePublicId: String,
        uploadedAt: Date,
        caption: String,
      },
    ],

    proofVideos: [
      {
        videoUrl: String,
        videoPublicId: String,
        uploadedAt: Date,
        caption: String,
      },
    ],

    // Certification & Verification
    isVerified: { type: Boolean, default: false },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    verificationDate: Date,

    // Liability & Insurance
    insuranceCovered: { type: Boolean, default: false },
    insuranceProvider: String,
    claimNumber: String,

    // Dispute Resolution
    disputeTerms: String,

    // Document Management
    agreementDocument: {
      documentUrl: String,
      documentPublicId: String,
      uploadedAt: Date,
    },

    // Admin Notes
    adminNotes: String,

    // Tracking
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

VeterinaryAgreementSchema.index({ veterinarian: 1, status: 1 });
VeterinaryAgreementSchema.index({ client: 1, status: 1 });
VeterinaryAgreementSchema.index({ animal: 1 });
VeterinaryAgreementSchema.index({ serviceType: 1 });
VeterinaryAgreementSchema.index({ serviceJob: 1 });

const VeterinaryAgreement = mongoose.model(
  "VeterinaryAgreement",
  VeterinaryAgreementSchema
);
export default VeterinaryAgreement;
