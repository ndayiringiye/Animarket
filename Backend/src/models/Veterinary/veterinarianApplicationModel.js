import mongoose from "mongoose";

const VeterinarianApplicationSchema = new mongoose.Schema(
  {
    jobPostingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VeterinaryJobPosting",
      required: true,
    },
    applicantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    applicantEmail: String,
    applicantPhone: String,
    status: {
      type: String,
      enum: ["submitted", "under_review", "shortlisted", "rejected", "accepted"],
      default: "submitted",
    },
    appliedDate: {
      type: Date,
      default: Date.now,
    },
    coverLetter: String,
    resume: {
      url: String,
      publicId: String,
    },
    certifications: [
      {
        name: String,
        issuingBody: String,
        issueDate: Date,
        expiryDate: Date,
        certificateUrl: String,
        publicId: String,
      },
    ],
    qualifications: {
      yearsOfExperience: Number,
      specializations: [String],
      previousWorkExperience: [
        {
          employerName: String,
          position: String,
          startDate: Date,
          endDate: Date,
          description: String,
        },
      ],
      references: [
        {
          name: String,
          title: String,
          email: String,
          phone: String,
        },
      ],
    },
    evaluationScore: {
      experience: Number, // 0-10
      qualifications: Number, // 0-10
      references: Number, // 0-10
      overallScore: Number, // 0-10
    },
    evaluationNotes: String,
    evaluatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    evaluationDate: Date,
    selectedForRole: Boolean,
    selectionNotes: String,
    acceptanceStatus: {
      type: String,
      enum: ["pending", "accepted", "declined"],
      default: "pending",
    },
    acceptanceDate: Date,
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
VeterinarianApplicationSchema.index({ jobPostingId: 1, status: 1 });
VeterinarianApplicationSchema.index({ applicantId: 1 });
VeterinarianApplicationSchema.index({ createdAt: -1 });

const VeterinarianApplication = mongoose.model(
  "VeterinarianApplication",
  VeterinarianApplicationSchema
);
export default VeterinarianApplication;