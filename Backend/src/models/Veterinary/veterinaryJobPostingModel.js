import mongoose from "mongoose";

const VeterinaryJobPostingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    jobType: {
      type: String,
      enum: ["permanent", "contract", "temporary", "freelance"],
      default: "contract",
    },

    // ── Animal this curing job is for ──────────────────────────────────
    animal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Animal",
      default: null,
    },
    animalType: {
      type: String,
      enum: [
        "cow", "goat", "sheep", "pig", "horse", "chicken",
        "rabbit", "donkey", "turkey", "duck", "dog", "cat",
        "camel", "buffalo", "other",
      ],
      default: null,
    },

    // ── Criteria / credentials required for this curing job ────────────
    criteria: {
      requiredCertifications: [String],   // e.g. ["Bovine Surgery License", "RVCP"]
      requiredTools: [String],            // e.g. ["Ultrasound machine", "IV kit"]
      minExperienceWithAnimalType: {      // years of experience with that animal
        type: Number,
        default: 0,
      },
      urgencyLevel: {
        type: String,
        enum: ["low", "medium", "high", "critical"],
        default: "medium",
      },
    },
    // ──────────────────────────────────────────────────────────────────

    location: {
      address: String,
      city: String,
      country: String,
      latitude: Number,
      longitude: Number,
    },
    salary: {
      min: Number,
      max: Number,
      currency: { type: String, default: "RWF" },
      period: { type: String, enum: ["hourly", "daily", "monthly", "project"] },
    },
    requiredQualifications: [String], // e.g., ["License", "5 years experience"]
    specializations: [String], // e.g., ["Bovine health", "Surgery"]
    experienceYearsRequired: {
      type: Number,
      default: 0,
    },
    responsibilities: [String],
    benefits: [String],
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    postedByRole: {
      type: String,
      enum: ["seller", "farmer", "admin"],
      required: true,
    },
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
    },
    status: {
      type: String,
      enum: ["open", "in_review", "filled", "closed"],
      default: "open",
    },
    applicationDeadline: {
      type: Date,
      required: true,
    },
    numberOfPositions: {
      type: Number,
      default: 1,
    },
    selectedApplicants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
    applicationCount: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index for faster queries
VeterinaryJobPostingSchema.index({ status: 1, applicationDeadline: 1 });
VeterinaryJobPostingSchema.index({ postedBy: 1 });
VeterinaryJobPostingSchema.index({ city: 1, country: 1 });

const VeterinaryJobPosting = mongoose.model(
  "VeterinaryJobPosting",
  VeterinaryJobPostingSchema
);
export default VeterinaryJobPosting;