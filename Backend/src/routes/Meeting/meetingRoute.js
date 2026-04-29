import express from "express";
import {
    createMeetingController,
    joinMeetingController,
    endMeetingController,
    acceptMeetingController,
    rejectMeetingController,
    getUserMeetingsController,
    getSingleMeetingController,
    addFeedbackController
} from "../../controllers/meetings/meeting.controller.js";

import { authenticateUser } from "../../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * 🔐 ALL ROUTES REQUIRE AUTH
 */
router.use(authenticateUser);


// ===============================
// 📅 CREATE & FETCH MEETINGS
// ===============================

// ➕ Create / Schedule meeting
router.post("/create", createMeetingController);

// 📥 Get all meetings for logged-in user
router.get("/", getUserMeetingsController);

// 🔍 Get single meeting details
router.get("/:meetingId", getSingleMeetingController);


// ===============================
// 👥 PARTICIPATION MANAGEMENT
// ===============================

// ✅ Accept meeting invite
router.put("/:meetingId/accept", acceptMeetingController);

// ❌ Reject meeting invite
router.put("/:meetingId/reject", rejectMeetingController);


// ===============================
// 🎥 VIDEO CALL FLOW
// ===============================

// ▶️ Join meeting
router.get("/:meetingId/join", joinMeetingController);

// ⏹️ End meeting (only organizer ideally)
router.put("/:meetingId/end", endMeetingController);


// ===============================
// ⭐ FEEDBACK SYSTEM
// ===============================

// ⭐ Add feedback after meeting
router.post("/:meetingId/feedback", addFeedbackController);


export default router;