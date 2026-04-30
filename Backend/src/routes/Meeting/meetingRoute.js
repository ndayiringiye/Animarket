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

router.use(authenticateUser);

router.post("/", createMeetingController);

router.get("/", getUserMeetingsController);

router.get("/:meetingId", getSingleMeetingController);

router.put("/:meetingId/accept", acceptMeetingController);


router.get("/:meetingId/join", joinMeetingController);

router.put("/:meetingId/end", endMeetingController);


router.post("/:meetingId/feedback", addFeedbackController);

// router.put("/:meetingId/start", startMeetingController);
// router.put("/:meetingId/cancel", cancelMeetingController);

// ADMIN
// router.get("/admin/all", getAllMeetingsAdminController);

// VETERINARY
// router.get("/vet/consultations", vetMeetingsController);

// LOGISTICS (future)
// router.post("/:meetingId/delivery-schedule", scheduleDeliveryController);

export default router;