import express from "express";
import * as veterinaryController from "../../controllers/Veterinary/veterinaryController.js";
import * as veterinaryJobController from "../../controllers/Veterinary/veterinaryJobController.js";
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

// ===== JOB POSTING ROUTES =====
router.post("/jobs/create", verifyToken, veterinaryJobController.createJobPosting);
router.get("/jobs", veterinaryJobController.getAllJobPostings);
router.get("/jobs/:jobId", veterinaryJobController.getJobPosting);
router.put("/jobs/:jobId", verifyToken, veterinaryJobController.updateJobPosting);

// ===== APPLICATION ROUTES =====
router.post("/jobs/:jobId/apply", verifyToken, veterinaryJobController.submitApplication);
router.get("/jobs/:jobId/applications", verifyToken, veterinaryJobController.getJobApplications);
router.post("/applications/:applicationId/evaluate", verifyToken, veterinaryJobController.evaluateApplication);
router.post("/applications/:applicationId/accept", verifyToken, veterinaryJobController.acceptSelectedVeterinarian);

// ===== VETERINARIAN PROFILE ROUTES =====
router.post("/profile/create", verifyToken, veterinaryJobController.createVeterinarianProfile);
router.get("/profile/:vetId", veterinaryJobController.getVeterinarianProfile);
router.put("/profile/:vetId", verifyToken, veterinaryJobController.updateVeterinarianProfile);
router.get("/top-veterinarians", veterinaryJobController.getTopVeterinarians);

// ===== INNOVATION ROUTES =====
router.post("/innovations/create", verifyToken, veterinaryJobController.createInnovation);
router.get("/innovations", veterinaryJobController.getAllInnovations);
router.get("/innovations/:innovationId", veterinaryJobController.getInnovation);
router.post("/innovations/:innovationId/rate", verifyToken, veterinaryJobController.rateInnovation);
router.put("/innovations/:innovationId", verifyToken, veterinaryJobController.updateInnovation);

export default router;
