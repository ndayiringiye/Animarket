import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    profile: { type: String, required: true },
    gender: { type: String, required: true },
    profile_img: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    id_Number: { type: String, required: true },
    id_proof_img: { type: String, required: true },
    category: { type: String, required: true, enum: ["Goat", "cow", "pigs", "sheep"] },
    shopName: { type: String, required: true },
    shopAddress: { type: String,enum:["home","market", "farm"] required: true },
    shopLogo: { type: String, required: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    role: {
        enum: ["seller", "admin", "customer", "farmer", "veterinary"], default: "customer"
    },
    createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", UserSchema);
export default User;