import mongoose from "mongoose";

const HotelAnimalBookingSchema = new mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
    animalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Animal",
      required: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    serviceType: {
      type: String,
      enum: ["boarding", "grooming", "training", "medical_care", "other"],
      required: true,
    },
    checkInDate: {
      type: Date,
      required: true,
    },
    checkOutDate: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number, // in days
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "RWF",
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "bank_transfer", "mobile_money"],
      default: "cash",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "in_progress", "completed", "cancelled"],
      default: "pending",
    },
    specialRequests: {
      type: String,
    },
    qrCode: {
      qrCodeData: String,
      qrCodeUrl: String,
      qrCodeGeneratedAt: Date,
    },
    notes: {
      type: String,
    },
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
HotelAnimalBookingSchema.index({ hotelId: 1, status: 1 });
HotelAnimalBookingSchema.index({ animalId: 1 });
HotelAnimalBookingSchema.index({ ownerId: 1 });

const HotelAnimalBooking = mongoose.model("HotelAnimalBooking", HotelAnimalBookingSchema);
export default HotelAnimalBooking;