import express from "express";
import * as veterinaryController from "../../controllers/Veterinary/veterinaryController.js";
import * as veterinaryJobController from "../../controllers/Veterinary/veterinaryJobController.js";
import { verifyToken } from "../../Middlewares/Auth/authMiddleware.js";
import { isVeterinarian, isVeterinarianOrOwner } from "../../Middlewares/Veterinary/veterinaryMiddleware.js";
import upload from "../../Middlewares/user/uplaodMiddleware.js";

const router = express.Router();

// Service Job Routes
router.post("/service-job/create", verifyToken, veterinaryController.createServiceJob);
router.get("/service-jobs", veterinaryController.listServiceJobs);
router.post("/service-job/:jobId/accept", verifyToken, isVeterinarian, veterinaryController.acceptServiceJob);
router.post("/service-job/:jobId/complete", verifyToken, isVeterinarian, veterinaryController.completeServiceJob);

// Agreement Routes
router.post("/agreement/create", verifyToken, isVeterinarian, veterinaryController.createAgreement);
router.post("/agreement/:agreementId/sign", verifyToken, veterinaryController.signVeterinaryAgreement);

router.post("/agreement/:agreementId/payment", verifyToken, veterinaryController.recordPayment);

router.post("/agreement/:agreementId/record-vaccination", verifyToken, isVeterinarian, veterinaryController.recordVaccination);

// QR Code Routes
router.post("/agreement/:agreementId/generate-qrcode", verifyToken, isVeterinarian, veterinaryController.generateServiceQRCode);
router.post("/qrcode/scan", veterinaryController.scanServiceQRCode);

// History Routes
router.get("/history/:veterinarianId", verifyToken, veterinaryController.getServiceHistory);

router.post("/jobs/create", verifyToken, veterinaryJobController.createJobPosting);
router.get("/jobs", veterinaryJobController.getAllJobPostings);
router.get("/jobs/:jobId", veterinaryJobController.getJobPosting);
router.put("/jobs/:jobId", verifyToken, veterinaryJobController.updateJobPosting);


router.post("/jobs/:jobId/apply", verifyToken, upload.fields([
  { name: 'resume', maxCount: 1 },
  { name: 'certifications', maxCount: 5 }
]), veterinaryJobController.submitApplication);
router.get("/jobs/:jobId/applications", verifyToken, veterinaryJobController.getJobApplications);
router.post("/applications/:applicationId/evaluate", verifyToken, veterinaryJobController.evaluateApplication);
router.post("/applications/:applicationId/accept", verifyToken, veterinaryJobController.acceptSelectedVeterinarian);

// ===== VETERINARIAN PROFILE ROUTES =====
router.post("/profile/create", verifyToken, upload.fields([
  { name: 'licenseDocument', maxCount: 1 },
  { name: 'educationCertificates', maxCount: 5 }
]), veterinaryJobController.createVeterinarianProfile);
router.get("/profile/:vetId", veterinaryJobController.getVeterinarianProfile);
router.put("/profile/:vetId", verifyToken, upload.fields([
  { name: 'licenseDocument', maxCount: 1 },
  { name: 'educationCertificates', maxCount: 5 }
]), veterinaryJobController.updateVeterinarianProfile);
router.get("/top-veterinarians", veterinaryJobController.getTopVeterinarians);

// ===== INNOVATION ROUTES =====
router.post("/innovations/create", verifyToken, upload.fields([
  { name: 'attachments', maxCount: 10 }
]), veterinaryJobController.createInnovation);
router.get("/innovations", veterinaryJobController.getAllInnovations);
router.get("/innovations/:innovationId", veterinaryJobController.getInnovation);
router.post("/innovations/:innovationId/rate", verifyToken, veterinaryJobController.rateInnovation);
router.put("/innovations/:innovationId", verifyToken, upload.fields([
  { name: 'attachments', maxCount: 10 }
]), veterinaryJobController.updateInnovation);

export default router;
