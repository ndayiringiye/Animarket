import mongoose from "mongoose";

const InterestSchema = new mongoose.Schema(
  {
    animal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Animal",
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    termMonths: {
      type: Number,
      required: true,
    },
    interestRate: {
      type: Number,
      default: 5.5,
    },
    estimatedInterest: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "completed"],
      default: "pending",
    },
    adminNotes: String,
  },
  { timestamps: true }
);

InterestSchema.index({ customer: 1, status: 1 });
InterestSchema.index({ animal: 1 });

const Interest = mongoose.model("Interest", InterestSchema);
export default Interest;
