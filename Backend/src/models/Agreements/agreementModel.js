import mongoose from "mongoose";

const { Schema } = mongoose;

const agreementSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, trim: true },

    type: {
      type: String,
      enum: ["sale", "veterinary_service", "job_request"],
      required: true,
      index: true,
    },

    parties: {
      buyer: { type: Schema.Types.ObjectId, ref: "User" },
      seller: { type: Schema.Types.ObjectId, ref: "User" },
      veterinarian: { type: Schema.Types.ObjectId, ref: "User" },
      requester: { type: Schema.Types.ObjectId, ref: "User" },
    },

    animal: {
      animalId: { type: Schema.Types.ObjectId, ref: "Animal", required: true },
      name: String,
      type: {
        type: String,
        enum: ["cow", "goat", "sheep", "pig", "horse", "chicken"],
      },
      breed: String,
      age: Number,
      healthStatus: String,
      weight: Number,
    },

    service: {
      type: {
        type: String,
        enum: ["vaccination", "checkup", "treatment", "consultation"],
      },
      notes: String,
      cost: Number,
    },

    price: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "RWF" },

    paymentMethod: {
      type: String,
      enum: ["mobile_money", "bank_transfer", "cash", "card"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    transactionId: { type: String, required: true, unique: true },

    signatures: {
      buyer: String,
      seller: String,
      vet: String,
    },

    location: { type: String, required: true },
    deliveryDate: Date,

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed", "cancelled"],
      default: "pending",
    },

    pdfUrl: String,
    emailSent: { type: Boolean, default: false },

    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

agreementSchema.index({ "parties.buyer": 1, "parties.seller": 1 });

const Agreement = mongoose.model("Agreement", agreementSchema);

export default Agreement;
