import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    emailOtp: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    phoneOtp: {
        type: String,
        required: true
    },
    // The TTL index: This record will auto-delete 10 minutes after 'createdAt'
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 600 // Time in seconds (600s = 10 minutes)
    }
}, { timestamps: true });

// Optional: Add index for faster lookups during verification
otpSchema.index({ email: 1 });

const Otp = mongoose.model("Otp", otpSchema);

export default Otp;
