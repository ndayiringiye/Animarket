import express from "express";
import * as veterinaryController from "../../controllers/Veterinary/veterinaryController.js";
import { verifyToken } from "../../Middlewares/Auth/authMiddleware.js";
import { isVeterinarian, isVeterinarianOrOwner } from "../../Middlewares/Veterinary/veterinaryMiddleware.js";

const router = express.Router();

// Service Job Routes
router.post("/service-job/create", verifyToken, veterinaryController.createServiceJob);
router.get("/service-jobs", veterinaryController.listServiceJobs);
router.post("/service-job/:jobId/accept", verifyToken, isVeterinarian, veterinaryController.acceptServiceJob);
router.post("/service-job/:jobId/complete", verifyToken, isVeterinarian, veterinaryController.completeServiceJob);

// Agreement Routes
router.post("/agreement/create", verifyToken, isVeterinarian, veterinaryController.createAgreement);
router.post("/agreement/:agreementId/sign", verifyToken, veterinaryController.signVeterinaryAgreement);

// Payment Routes
router.post("/agreement/:agreementId/payment", verifyToken, veterinaryController.recordPayment);

// Vaccination Routes
router.post("/agreement/:agreementId/record-vaccination", verifyToken, isVeterinarian, veterinaryController.recordVaccination);

// QR Code Routes
router.post("/agreement/:agreementId/generate-qrcode", verifyToken, isVeterinarian, veterinaryController.generateServiceQRCode);
router.post("/qrcode/scan", veterinaryController.scanServiceQRCode);

// History Routes
router.get("/history/:veterinarianId", verifyToken, veterinaryController.getServiceHistory);

export default router;
