import mongoose from "mongoose";

const QRCodeTrackingSchema = new mongoose.Schema(
  {
    // QR Code Information
    qrCodeData: { type: String, required: true, unique: true },
    qrCodeUrl: String,
    qrCodeImage: String,
    qrCodePublicId: String,

    // Reference to Agreement
    veterinaryAgreement: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VeterinaryAgreement",
      required: true,
    },

    // Reference to Service Job
    serviceJob: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VeterinaryServiceJob",
    },

    // Service Information
    serviceType: String,
    serviceName: String,
    serviceDate: Date,

    // Veterinarian Information
    veterinarian: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    veterinarianName: String,
    veterinarianEmail: String,
    veterinarianLicense: String,

    // Client/Owner Information
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    clientName: String,
    clientRole: String,

    // Animal Information
    animal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Animal",
      required: true,
    },
    animalName: String,
    animalType: String,
    breed: String,

    // Service Proof
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

    // QR Code Scans/Access
    scanCount: { type: Number, default: 0 },
    lastScannedAt: Date,
    scanHistory: [
      {
        scannedAt: Date,
        scannedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        ipAddress: String,
        deviceInfo: String,
      },
    ],

    // Validity
    isActive: { type: Boolean, default: true },
    expiryDate: Date,
    revokedAt: Date,
    revocationReason: String,

    // Metadata
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

QRCodeTrackingSchema.index({ qrCodeData: 1 });
QRCodeTrackingSchema.index({ veterinaryAgreement: 1 });
QRCodeTrackingSchema.index({ veterinarian: 1 });
QRCodeTrackingSchema.index({ animal: 1 });
QRCodeTrackingSchema.index({ isActive: 1 });

const QRCodeTracking = mongoose.model("QRCodeTracking", QRCodeTrackingSchema);
export default QRCodeTracking;
