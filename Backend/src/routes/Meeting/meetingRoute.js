import express from "express";
import {
    createMeetingController,
    getUserMeetingsController,
    getSingleMeetingController,
    acceptMeetingController,
    joinMeetingController,
    endMeetingController,
    addFeedbackController
} from "../../controllers/Meeting/MeetingController.js";

import { authenticateUser } from "../../Middlewares/Auth/authMiddleware.js";

const router = express.Router();

// Apply authentication to all meeting routes
router.use(authenticateUser);


// Create Meeting (Support both WebRTC & Real Zoom)
router.post("/", createMeetingController);

// Get All User's Meetings (as organizer or participant)
router.get("/", getUserMeetingsController);

// Get Single Meeting Details
router.get("/:meetingId", getSingleMeetingController);

// Accept Meeting Invitation
router.put("/:meetingId/accept", acceptMeetingController);

// Join Meeting (Returns meetingLink, startUrl, password for Zoom)
router.get("/:meetingId/join", joinMeetingController);

// End Meeting (Only organizer)
router.put("/:meetingId/end", endMeetingController);

// Add Feedback after meeting
router.post("/:meetingId/feedback", addFeedbackController);

// ====================== FUTURE / COMMENTED ROUTES ======================

// router.put("/:meetingId/start", startMeetingController);
// router.put("/:meetingId/cancel", cancelMeetingController);

// ====================== ROLE-BASED ROUTES (Future) ======================

// ADMIN ROUTES
// router.get("/admin/all", getAllMeetingsAdminController);

// VETERINARY ROUTES
// router.get("/vet/consultations", vetMeetingsController);

// LOGISTICS ROUTES
// router.post("/:meetingId/delivery-schedule", scheduleDeliveryController);

export default router;