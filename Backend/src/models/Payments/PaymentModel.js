// models/Payment.js
import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    transactionId: { type: String, unique: true, required: true },
    
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HotelAnimalBooking",
      required: true,
    },
    
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
    
    payerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    
    amount: { type: Number, required: true },
    currency: { type: String, default: "RWF" },
    
    adminCommissionRate: { type: Number, default: 8 }, // 8%
    adminCommissionAmount: Number,
    netAmountToHotel: Number,
    
    paymentMethod: {
      type: String,
      enum: ["mobile_money", "card", "bank_transfer", "cash"],
    },
    status: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    
    paymentGatewayResponse: Object,
  },
  { timestamps: true }
);

PaymentSchema.index({ bookingId: 1 });
PaymentSchema.index({ hotelId: 1, status: 1 });

const Payment = mongoose.model("Payment", PaymentSchema);
export default Payment;