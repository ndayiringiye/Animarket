import mongoose from "mongoose";

const sellerShema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    profile: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    category: { type: String, required: true, enum: ["Goat", "cow", "pigs", "sheep"] },
    shopName: { type: String, required: true },
    shopAddress: { type: String, required: true },
    shopLogo: { type: String, required: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    role: {
        enum: ["seller", "admin", "customer"], default: "customer"
    },
    createdAt: { type: Date, default: Date.now },
});

const Seller = mongoose.model("Seller", sellerShema);
export default Seller;