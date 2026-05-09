import {
    createMeetingService,
    getUserMeetingsService,
    getSingleMeetingService,
    acceptMeetingService,
    joinMeetingService,
    endMeetingService,
    addFeedbackService
} from "../../services/meeting/meetingService.js";


const createMeetingController = async (req, res) => {
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
        console.error("Create Meeting Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Server error"
        });
    }
};


const getUserMeetingsController = async (req, res) => {
    try {
        const userId = req.user.id;
        const meetings = await getUserMeetingsService(userId);

        return res.status(200).json({
            success: true,
            data: meetings
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


const getSingleMeetingController = async (req, res) => {
    try {
        const { meetingId } = req.params;
        const meeting = await getSingleMeetingService(meetingId);

        return res.status(200).json({
            success: true,
            data: meeting
        });

    } catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message
        });
    }
};


const acceptMeetingController = async (req, res) => {
    try {
        const userId = req.user.id;
        const { meetingId } = req.params;

        const meeting = await acceptMeetingService(meetingId, userId);

        return res.status(200).json({
            success: true,
            message: "Meeting accepted successfully",
            data: meeting
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


const joinMeetingController = async (req, res) => {
    try {
        const userId = req.user.id;
        const { meetingId } = req.params;

        const data = await joinMeetingService(meetingId, userId);

        return res.status(200).json({
            success: true,
            message: "Joined meeting successfully",
            ...data   // Returns meetingLink, startUrl, password, token, provider
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


const endMeetingController = async (req, res) => {
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
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


const addFeedbackController = async (req, res) => {
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
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export {
    createMeetingController,
    getUserMeetingsController,
    getSingleMeetingController,
    acceptMeetingController,
    joinMeetingController,
    endMeetingController,
    addFeedbackController
};