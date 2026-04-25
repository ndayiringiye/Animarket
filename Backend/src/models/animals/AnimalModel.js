import mongoose from "mongoose";

const AnimalSchema = new mongoose.Schema({
    // 🧠 CORE IDENTITY
    name: { type: String, required: true },
    type: { 
        type: String, 
        required: true, 
        enum: ["cow", "goat", "sheep", "pig", "horse", "chicken"] 
    },
    breed: { type: String, required: true },
    gender: { type: String, enum: ["male", "female"], required: true },
    age: { type: Number, required: true },

    // 💰 MARKET VALUE
    price: { type: Number, required: true },
    currency: { type: String, default: "RWF" },

    aiEstimatedValue: { type: Number, default: 0 }, 
    health: {
        vaccinated: { type: Boolean, default: false },
        vaccinationRecords: [
            {
                vaccineName: String,
                date: Date,
                verifiedByVet: Boolean,
                vaccinationProof: {
                    type: String,
                    enum: ["image","video","pdf","text"],
                },
                extention:{
                    type:String,
                    enum:["png","jpg","jpeg","mp4","pdf","text"]
                }
            }
        ],
        diseasesHistory: [String],
        lastCheckupDate: Date,
        healthStatus: {
            type: String,
            enum: ["excellent", "good", "fair", "poor"],
            default: "good"
        }
    },
    location: {
        country: String,
        province: String,
        district: String,
        sector: String,
        cell: String,
        village: String,
        latitude: Number,
        longitude: Number
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    previousOwners: [
        {
            ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            transferredAt: Date,
            price: Number
        }
    ],
    previousOwnerName: { type: String, required: false },
    previousOwnerPhone: { type: String, required: false },
    previousOwnerAgreementPhoto: { type: String, required: false },
   previousOwnerIdType: { type: String, required: false },
   previousOwnerIdNumber: { type: String, required: false },
   previousOwnerIdPhoto: { type: String, required: false },
   previousOwnerGender: { type: String, required: false },
   previousOwnerAge: { type: Number, required: false },
    images: [String],
    videos: [String],
 weight:{ 
    type:Number,
    required:false,
 },
    isAvailable: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },

    verificationLevel: {
        type: String,
        enum: ["unverified", "basic", "veterinary_verified", "premium_verified"],
        default: "unverified"
    },

    marketDemandScore: { type: Number, default: 0 },
    popularityScore: { type: Number, default: 0 },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Animal = mongoose.model("Animal", AnimalSchema);
export default Animal;