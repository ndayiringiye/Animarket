import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    profile: { type: String, required: true },
    gender: { type: String, required: true },
    profile_img: { type: String, required: true },
    profile_img_public_id: { type: String },
    isVerified: { type: Boolean, default: false },
    id_Number: { type: String, required: true },
    id_proof_img: { type: String, required: true },
    id_proof_img_public_id: { type: String },
    category: { type: String, required: true, enum: ["Goat", "cow", "pigs", "sheep"] },
    shopName: { type: String, required: true },
    shopAddress: { type: String, required: true },
    shopLogo: { type: String, required: true },
    shopLogo_public_id: { type: String },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    role: {
        type: String, enum: ["seller", "admin", "customer", "farmer", "veterinary"], default: "customer"
    },
    resetToken: { type: String, default: null },
    resetTokenExpiry: { type: Date, default: null },
    resetOTP: { type: String, default: null },
    resetOTPExpiry: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", UserSchema);
export default User;