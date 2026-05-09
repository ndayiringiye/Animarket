// models/Meetings/MeetingModel.js
import mongoose from "mongoose";

const MeetingSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: String,

    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    organizerType: {
        type: String,
        enum: ["user", "hotel"],
        default: "user"
    },

    participants: [{
        user: { type: mongoose.Schema.Types.ObjectId, required: true },
        type: { type: String, enum: ["user", "hotel"], default: "user" },
        role: { type: String, enum: ["seller", "admin", "customer", "farmer", "veterinary", "hotel"], required: true },
        status: {
            type: String,
            enum: ["invited", "accepted", "rejected", "joined", "left"],
            default: "invited"
        }
    }],

    meetingType: {
        type: String,
        enum: ["animal_inspection", "transaction_discussion", "vet_consultation", "delivery_planning", "dispute_resolution", "general"],
        default: "general"
    },

    animal: { type: mongoose.Schema.Types.ObjectId, ref: "Animal" },

    meetingDate: { type: Date, required: true },
    durationMinutes: { type: Number, default: 30 },
    timezone: { type: String, default: "Africa/Kigali" },

    videoCall: {
        provider: {
            type: String,
            enum: ["webrtc", "zoom", "google_meet", "custom"],
            default: "webrtc"
        },
        meetingId: String,
        meetingLink: String,
        startUrl: String,           // Important for host
        password: String,
        hostToken: String,
        participantToken: String,
        recordingUrl: String
    },

    zoomMeetingData: { type: mongoose.Schema.Types.Mixed }, // Full Zoom response

    physicalLocation: {
        address: String,
        latitude: Number,
        longitude: Number
    },

    status: {
        type: String,
        enum: ["pending", "accepted", "rejected", "cancelled", "ongoing", "completed", "expired"],
        default: "pending"
    },

    feedback: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        rating: Number,
        comment: String
    }],

    joinCount: { type: Number, default: 0 },
    lastJoinedAt: Date,

}, { timestamps: true });

const Meeting = mongoose.model("Meeting", MeetingSchema);
export default Meeting;