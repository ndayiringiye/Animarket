import {
    createMeetingService,
    getUserMeetingsService,
    getSingleMeetingService,
    acceptMeetingService,
    joinMeetingService,
    endMeetingService,
    addFeedbackService,
    startMeetingService,
    cancelMeetingService
} from "../../services/meeting/meetingService.js";

export const createMeetingController = async (req, res) => {
    try {
        const meeting = await createMeetingService(req);

        return res.status(201).json({
            success: true,
            message: req.body.provider === "zoom" 
                ? "Real Zoom meeting created successfully" 
                : "Meeting scheduled successfully",
            data: meeting
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const startMeetingController = async (req, res) => {
    try {
        const userId = req.user.id;
        const { meetingId } = req.params;

        const meeting = await startMeetingService(meetingId, userId);

        return res.status(200).json({
            success: true,
            message: "Meeting started successfully",
            data: meeting
        });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

export const cancelMeetingController = async (req, res) => {
    try {
        const userId = req.user.id;
        const { meetingId } = req.params;

        const meeting = await cancelMeetingService(meetingId, userId);

        return res.status(200).json({
            success: true,
            message: "Meeting cancelled successfully",
            data: meeting
        });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

export const getUserMeetingsController = async (req, res) => {
    try {
        const userId = req.user.id;
        const meetings = await getUserMeetingsService(userId);

        return res.status(200).json({ success: true, data: meetings });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getSingleMeetingController = async (req, res) => {
    try {
        const { meetingId } = req.params;
        const meeting = await getSingleMeetingService(meetingId);

        return res.status(200).json({ success: true, data: meeting });
    } catch (error) {
        return res.status(404).json({ success: false, message: error.message });
    }
};

export const acceptMeetingController = async (req, res) => {
    try {
        const userId = req.user.id;
        const { meetingId } = req.params;

        const meeting = await acceptMeetingService(meetingId, userId);

        return res.status(200).json({
            success: true,
            message: "Meeting accepted",
            data: meeting
        });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

export const joinMeetingController = async (req, res) => {
    try {
        const userId = req.user.id;
        const { meetingId } = req.params;

        const data = await joinMeetingService(meetingId, userId);

        return res.status(200).json({
            success: true,
            message: "Joined meeting successfully",
            ...data
        });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

export const endMeetingController = async (req, res) => {
    try {
        const userId = req.user.id;
        const { meetingId } = req.params;

        const meeting = await endMeetingService(meetingId, userId);

        return res.status(200).json({
            success: true,
            message: "Meeting ended successfully",
            data: meeting
        });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

export const addFeedbackController = async (req, res) => {
    try {
        const userId = req.user.id;
        const { meetingId } = req.params;
        const { rating, comment } = req.body;

        const meeting = await addFeedbackService(meetingId, userId, { rating, comment });

        return res.status(200).json({
            success: true,
            message: "Feedback added successfully",
            data: meeting
        });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};