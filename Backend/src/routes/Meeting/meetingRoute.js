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
    cancelMeetingController,
    updateMeetingController,
    grantNegotiationAccessController
} from "../../controllers/Meeting/MeetingController.js";

import { verifyToken } from "../../Middlewares/Auth/authMiddleware.js";
import {
    validateCreateMeeting,
    validateMeetingId,
    validateFeedback
} from "../../validoators/meetings/meetingValidator.js";

const router = express.Router();

router.use(verifyToken);


router.post("/", validateCreateMeeting, createMeetingController);

router.get("/", getUserMeetingsController);

router.get("/:meetingId", validateMeetingId, getSingleMeetingController);

router.put("/:meetingId/accept", validateMeetingId, acceptMeetingController);

router.post("/:meetingId/join", validateMeetingId, joinMeetingController);

router.put("/:meetingId/start", validateMeetingId, startMeetingController);
router.put("/:meetingId/end", validateMeetingId, endMeetingController);
router.put("/:meetingId/cancel", validateMeetingId, cancelMeetingController);
router.put("/:meetingId/cancel", validateMeetingId, cancelMeetingController);

router.put("/:meetingId", validateMeetingId, updateMeetingController);
router.put("/:meetingId/grant-access", validateMeetingId, grantNegotiationAccessController);
router.post("/:meetingId/feedback", validateMeetingId, validateFeedback, addFeedbackController);

export default router;