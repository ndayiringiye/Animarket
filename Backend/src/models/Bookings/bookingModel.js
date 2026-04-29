import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({

    bookingNumber: {
        type: String,
        unique: true
    },

    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    animal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Animal",
        required: true
    },
    meeting: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Meeting"
    },
    price: {
        type: Number,
        required: true
    },

    negotiatedPrice: {
        type: Number
    },

    currency: {
        type: String,
        default: "RWF"
    },

    paymentMethod: {
        type: String,
        enum: ["stripe", "momo", "bank", "cash"],
        default: "momo"
    },

    paymentStatus: {
        type: String,
        enum: [
            "pending",
            "initiated",
            "held_in_escrow",
            "paid",
            "failed",
            "refunded"
        ],
        default: "pending"
    },

    escrowStatus: {
        type: String,
        enum: [
            "not_applicable",
            "holding",
            "released",
            "disputed"
        ],
        default: "not_applicable"
    },

    transactionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction"
    },
    deliveryOption: {
        type: String,
        enum: ["pickup", "platform_delivery"],
        default: "pickup"
    },

    deliveryAddress: {
        address: String,
        latitude: Number,
        longitude: Number
    },

    deliveryStatus: {
        type: String,
        enum: [
            "not_scheduled",
            "scheduled",
            "in_transit",
            "delivered",
            "failed"
        ],
        default: "not_scheduled"
    },
trackingHistory: [
    {
        status: String,
        message: String,
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }
],

    deliveryDate: Date,
    status: {
        type: String,
        enum: [
            "pending",           
            "confirmed",        
            "rejected",
            "cancelled",
            "in_progress",       
            "completed",         
            "disputed"
        ],
        default: "pending"
    },
    feedback: {
        buyerRating: Number,
        sellerRating: Number,
        comment: String
    },
    isNegotiated: {
        type: Boolean,
        default: false
    },

    isPaid: {
        type: Boolean,
        default: false
    },

    isDelivered: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }

});

BookingSchema.pre("save", function (next) {
    if (!this.bookingNumber) {
        this.bookingNumber = "BOOK-" + Date.now();
    }
    next();
});


const Booking = mongoose.model("Booking", BookingSchema);

export default Booking;