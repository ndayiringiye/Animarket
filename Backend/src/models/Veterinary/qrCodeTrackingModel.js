import mongoose from "mongoose";

const QRCodeTrackingSchema = new mongoose.Schema(
  {
    qrCodeData: {
      type: String,
      required: true,
      unique: true,
    },

    qrCodeUrl: String,
    qrCodeImage: String,
    qrCodePublicId: String,

    veterinaryAgreement: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VeterinaryAgreement",
      required: true,
    },

    serviceJob: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VeterinaryServiceJob",
    },

    serviceType: String,
    serviceName: String,
    serviceDate: Date,

    veterinarian: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    veterinarianName: String,
    veterinarianEmail: String,
    veterinarianLicense: String,

    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    clientName: String,
    clientRole: String,

    animal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Animal",
      required: true,
    },

    animalName: String,
    animalType: String,
    breed: String,

    serviceProof: {
      vaccinationDetails: {
        vaccineName: String,
        vaccinationDate: Date,
        nextVaccinationDate: Date,
      },

      healthStatus: String,
      treatmentDetails: String,

      medications: [String],
    },

    scanCount: {
      type: Number,
      default: 0,
    },

    lastScannedAt: Date,

    scanHistory: [
      {
        scannedAt: Date,

        scannedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },

        ipAddress: String,
        deviceInfo: String,
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },

    expiryDate: Date,

    revokedAt: Date,

    revocationReason: String,
  },
  {
    timestamps: true,
  }
);

QRCodeTrackingSchema.index({ veterinaryAgreement: 1 });
QRCodeTrackingSchema.index({ veterinarian: 1 });
QRCodeTrackingSchema.index({ animal: 1 });
QRCodeTrackingSchema.index({ isActive: 1 });

const QRCodeTracking = mongoose.model(
  "QRCodeTracking",
  QRCodeTrackingSchema
);

export default QRCodeTracking;