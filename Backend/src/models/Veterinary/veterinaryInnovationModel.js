import mongoose from "mongoose";

const VeterinaryInnovationSchema = new mongoose.Schema(
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
    category: {
      type: String,
      enum: [
        "treatment",
        "technology",
        "vaccine",
        "diagnostic",
        "surgical_technique",
        "preventive_care",
        "other",
      ],
      required: true,
    },
    applicableAnimalTypes: [
      {
        type: String,
        enum: ["cow", "goat", "sheep", "pig", "horse", "chicken", "all"],
      },
    ],
    innovator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    innovatorName: String,
    content: {
      overview: String,
      howItWorks: String,
      benefits: [String],
      limitations: [String],
      costEstimate: {
        amount: Number,
        currency: String,
      },
      implementationTime: String,
      successRate: Number, // percentage 0-100
    },
    attachments: [
      {
        fileName: String,
        url: String,
        publicId: String,
        fileType: String,
      },
    ],
    caseStudies: [
      {
        title: String,
        description: String,
        results: String,
        location: String,
        date: Date,
      },
    ],
    feedback: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        rating: { type: Number, min: 1, max: 5 },
        comment: String,
        helpful: Boolean,
        date: { type: Date, default: Date.now },
      },
    ],
    averageRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "published",
    },
    relatedInnovations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "VeterinaryInnovation",
      },
    ],
    tags: [String],
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
VeterinaryInnovationSchema.index({ category: 1, status: 1 });
VeterinaryInnovationSchema.index({ innovator: 1 });
VeterinaryInnovationSchema.index({ featured: 1 });
VeterinaryInnovationSchema.index({ tags: 1 });

const VeterinaryInnovation = mongoose.model(
  "VeterinaryInnovation",
  VeterinaryInnovationSchema
);
export default VeterinaryInnovation;