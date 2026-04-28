import mongoose from "mongoose";

const { Schema } = mongoose;

const agreementSchema = new Schema(
  {
    // Basic agreement info
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    description: {
      type: String,
      trim: true,
    },

    // Parties involved
    buyer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    seller: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Animal snapshot (important: don't rely only on reference)
    animal: {
      animalId: {
        type: Schema.Types.ObjectId,
        ref: "Animal",
        required: true,
      },
      name: String,
      type: String, // cow, goat, sheep, etc.
      enum: ["cow", "goat", "sheep", "pig", "horse", "chicken"],
      breed: String,
      age: Number,
      healthStatus: String,
      weight: Number,
    },

    // Pricing & payment
    price: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      default: "RWF",
    },

    paymentMethod: {
      type: String,
      enum: ["mobile_money", "bank_transfer", "cash", "card"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },

    transactionId: {
      type: String,
      required: true,
      unique: true,
    },

    // Agreement terms
    terms: {
      type: String,
      required: true,
    },

    // Digital signatures (very important for trust)
    buyerSignature: {
      type: String,
    },

    sellerSignature: {
      type: String,
    },

    // Logistics
    location: {
      type: String,
      required: true,
    },

    deliveryDate: {
      type: Date,
    },

    // Status lifecycle
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed", "cancelled"],
      default: "pending",
      index: true,
    },

    // Audit & tracking
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true, // createdAt & updatedAt
  }
);

// Index for faster queries
agreementSchema.index({ buyer: 1, seller: 1 });
agreementSchema.index({ transactionId: 1 });

const Agreement = mongoose.model("Agreement", agreementSchema);

export default Agreement;