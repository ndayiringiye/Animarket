import express from "express";
import {
    createMeetingController,
    getUserMeetingsController,
    getSingleMeetingController,
    acceptMeetingController,
    joinMeetingController,
    endMeetingController,
    addFeedbackController,
    startMeetingController,
    cancelMeetingController
} from "../../controllers/Meeting/MeetingController.js";

import { authenticateUser } from "../../Middlewares/Auth/authMiddleware.js";

const router = express.Router();

router.use(authenticateUser);

// Main Routes
router.post("/", createMeetingController);
router.get("/", getUserMeetingsController);
router.get("/:meetingId", getSingleMeetingController);

router.put("/:meetingId/accept", acceptMeetingController);
router.post("/:meetingId/join", joinMeetingController);     // Changed to POST (better practice)
router.put("/:meetingId/start", startMeetingController);
router.put("/:meetingId/end", endMeetingController);
router.put("/:meetingId/cancel", cancelMeetingController);

router.post("/:meetingId/feedback", addFeedbackController);

export default router;