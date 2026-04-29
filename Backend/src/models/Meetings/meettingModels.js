import mongoose from "mongoose";

const MeetingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },

    description: String,
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    participants: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            },

            role: {
                type: String,
                enum: ["seller", "admin", "customer", "farmer", "veterinary"],
                required: true
            },

            status: {
                type: String,
                enum: ["invited", "accepted", "rejected", "joined", "left"],
                default: "invited"
            }
        }
    ],
    meetingType: {
        type: String,
        enum: [
            "animal_inspection",     
            "transaction_discussion",
            "vet_consultation",      
            "delivery_planning",
            "dispute_resolution",    
            "general"
        ],
        default: "general"
    },
    animal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Animal"
    },
    meetingDate: {
        type: Date,
        required: true
    },

    durationMinutes: {
        type: Number,
        default: 30
    },

    timezone: {
        type: String,
        default: "Africa/Kigali"
    },

    videoCall: {
        provider: {
            type: String,
            enum: ["webrtc", "zoom", "google_meet", "custom"],
            default: "webrtc"
        },

        meetingLink: String,
        meetingId: String,

        hostToken: String,
        participantToken: String,

        recordingUrl: String
    },

    physicalLocation: {
        address: String,
        latitude: Number,
        longitude: Number
    },

    status: {
        type: String,
        enum: [
            "pending",
            "accepted",
            "rejected",
            "cancelled",
            "ongoing",
            "completed",
            "expired"
        ],
        default: "pending"
    },

    feedback: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            rating: Number,
            comment: String
        }
    ],

    joinCount: {
        type: Number,
        default: 0
    },

    lastJoinedAt: Date,

    createdAt: {
        type: Date,
        default: Date.now
    },

    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const Meeting = mongoose.model("Meeting", MeetingSchema);

export default Meeting;