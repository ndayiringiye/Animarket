import mongoose from "mongoose";

const HotelSellerAgreementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    type: {
      type: String,
      enum: ["supply", "partnership", "service", "other"],
      required: true,
    },
    parties: {
      hotel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hotel",
        required: true,
      },
      seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
    services: [
      {
        serviceType: String,
        description: String,
        price: Number,
        currency: { type: String, default: "RWF" },
      },
    ],
    financialTerms: {
      paymentTerms: String,
      commission: Number,
      minimumOrder: Number,
    },
    deliveryTerms: {
      deliveryMethod: String,
      deliveryTime: String,
      location: String,
    },
    cancellationTerms: String,
    liabilityInsurance: String,
    disputeResolution: String,
    confidentialityTerms: String,
    signatures: {
      hotelSignature: String,
      hotelSignedAt: Date,
      sellerSignature: String,
      sellerSignedAt: Date,
    },
    status: {
      type: String,
      enum: ["draft", "sent", "pending_approval", "active", "terminated", "rejected"],
      default: "draft",
    },
    notes: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    terminatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
    },
    terminationReason: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index for faster queries
HotelSellerAgreementSchema.index({ "parties.hotel": 1, status: 1 });
HotelSellerAgreementSchema.index({ "parties.seller": 1, status: 1 });

const HotelSellerAgreement = mongoose.model("HotelSellerAgreement", HotelSellerAgreementSchema);
export default HotelSellerAgreement;