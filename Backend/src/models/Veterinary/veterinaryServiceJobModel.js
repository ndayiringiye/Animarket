import mongoose from "mongoose";

const VeterinaryServiceJobSchema = new mongoose.Schema(
  {
    // Job Details
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },

    // Service Type
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
      index: true,
    },

    // Animal Information
    animal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Animal",
      required: true,
    },
    animalName: String,
    animalType: String,
    animalHealth: String,

    // Owner/Requester Information
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    requesterRole: {
      type: String,
      enum: ["farmer", "seller", "customer"],
      required: true,
    },

    // Location
    location: {
      address: String,
      city: String,
      country: String,
      latitude: Number,
      longitude: Number,
    },

    // Job Status
    status: {
      type: String,
      enum: [
        "posted",
        "pending_acceptance",
        "accepted",
        "in_progress",
        "completed",
        "cancelled",
        "rejected",
      ],
      default: "posted",
      index: true,
    },

    // Assigned Veterinary
    assignedVeterinarian: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    veterinarianName: String,
    veterinarianEmail: String,

    // Pricing
    estimatedCost: { type: Number, required: true },
    finalCost: { type: Number },
    currency: { type: String, default: "RWF" },

    // Payment Information
    paymentStatus: {
      type: String,
      enum: ["pending", "partial", "paid", "overdue"],
      default: "pending",
      index: true,
    },
    paymentMethod: {
      type: String,
      enum: ["bank_transfer", "mobile_money", "cash", "card"],
    },
    paidAmount: { type: Number, default: 0 },
    paymentDate: Date,
    transactionId: String,

    // Service Details
    serviceDate: { type: Date, required: true },
    completionDate: Date,
    estimatedDuration: String, // e.g., "2 hours", "1 day"

    // Notes & Observations
    notes: String,
    veterinarianNotes: String,

    // Dates
    createdAt: { type: Date, default: Date.now, index: true },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

VeterinaryServiceJobSchema.index({ animal: 1, status: 1 });
VeterinaryServiceJobSchema.index({ requester: 1, status: 1 });
VeterinaryServiceJobSchema.index({ assignedVeterinarian: 1, status: 1 });
VeterinaryServiceJobSchema.index({ serviceDate: 1 });

const VeterinaryServiceJob = mongoose.model(
  "VeterinaryServiceJob",
  VeterinaryServiceJobSchema
);
export default VeterinaryServiceJob;
