import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    profile: { type: String, required: true },
    gender: { type: String, required: true },
    profile_img: { type: String, required: true },
    profile_img_public_id: { type: String },
    
    id_Number: { type: String, required: true },
    id_proof_img: { type: String, required: true },
    id_proof_img_public_id: { type: String },

    category: { 
        type: String, 
        required: true, 
        enum: [
            "cow", "goat", "sheep", "pig",  "chicken",
            "rabbit", 
        ]
    },
    
    shopName: { type: String, required: true },
    shopAddress: { type: String, required: true },
    shopLogo: { type: String, required: true },
    shopLogo_public_id: { type: String },

    role: {
        type: String, 
        enum: [  "customer", "farmer", "sale agent", "veterinary", "hotel", "admin"], 
        default: "customer"
    },
    
    status: { 
        type: String, 
        enum: ["pending", "approved", "rejected"], 
        default: "pending" 
    },
    
    isVerified: { type: Boolean, default: false },

    resetToken: { type: String, default: null },
    resetTokenExpiry: { type: Date, default: null },
    resetOTP: { type: String, default: null },
    resetOTPExpiry: { type: Date, default: null },

    createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

const User = mongoose.model("User", UserSchema);
export default User;