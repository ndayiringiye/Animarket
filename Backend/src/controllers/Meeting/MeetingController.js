import User from "../../models/users/UserModel.js";
import Animal from "../../models/animals/AnimalModel.js";
import Meeting from "../../models/meetings/MeetingModel.js";

import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";

export const createMeetingController = async (req, res) => {
    try {
        const {
            title,
            description,
            participants,
            meetingType,
            animalId,
            meetingDate,
            durationMinutes,
            provider
        } = req.body;

        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const organizer = await User.findById(userId);
        if (!organizer) {
            return res.status(404).json({ message: "Organizer not found" });
        }

        if (!participants || participants.length === 0) {
            return res.status(400).json({ message: "Participants required" });
        }

        const validParticipants = [];

        for (const p of participants) {
            const user = await User.findById(p.user);

            if (!user) {
                return res.status(404).json({
                    message: `User not found: ${p.user}`
                });
            }

            validParticipants.push({
                user: user._id,
                role: p.role,
                status: "invited"
            });
        }

        let animal = null;
        if (animalId) {
            animal = await Animal.findById(animalId);
            if (!animal) {
                return res.status(404).json({ message: "Animal not found" });
            }
        }

        const meetingUUID = uuidv4();

        const hostToken = crypto.randomBytes(16).toString("hex");
        const participantToken = crypto.randomBytes(16).toString("hex");

        const videoCall = {
            provider: provider || "webrtc",
            meetingId: meetingUUID,
            meetingLink:
                provider === "zoom"
                    ? `https://zoom.us/j/${meetingUUID}`
                    : `${process.env.FRONTEND_URL}/meeting/${meetingUUID}`,
            hostToken,
            participantToken
        };

        const meeting = await Meeting.create({
            title,
            description,
            organizer: organizer._id,
            participants: validParticipants,
            meetingType,
            animal: animal?._id,
            meetingDate,
            durationMinutes: durationMinutes || 30,
            videoCall,
            status: "pending"
        });

        return res.status(201).json({
            success: true,
            message: "Meeting created successfully",
            data: meeting
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

export const getUserMeetingsController = async (req, res) => {
    try {
        const userId = req.user.id;

        const meetings = await Meeting.find({
            $or: [
                { organizer: userId },
                { "participants.user": userId }
            ]
        })
            .populate("organizer", "name email")
            .populate("participants.user", "name email")
            .populate("animal");

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

export const getSingleMeetingController = async (req, res) => {
    try {
        const { meetingId } = req.params;

        const meeting = await Meeting.findById(meetingId)
            .populate("organizer")
            .populate("participants.user")
            .populate("animal");

        if (!meeting) {
            return res.status(404).json({ message: "Meeting not found" });
        }

        return res.status(200).json({
            success: true,
            data: meeting
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


export const acceptMeetingController = async (req, res) => {
    try {
        const userId = req.user.id;
        const { meetingId } = req.params;

        const meeting = await Meeting.findById(meetingId);
        if (!meeting) {
            return res.status(404).json({ message: "Meeting not found" });
        }

        const participant = meeting.participants.find(
            (p) => p.user.toString() === userId
        );

        if (!participant) {
            return res.status(403).json({ message: "Not invited" });
        }

        participant.status = "accepted";
        await meeting.save();

        return res.status(200).json({
            success: true,
            message: "Meeting accepted",
            data: meeting
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


export const joinMeetingController = async (req, res) => {
    try {
        const userId = req.user.id;
        const { meetingId } = req.params;

        const meeting = await Meeting.findById(meetingId);

        if (!meeting) {
            return res.status(404).json({ message: "Meeting not found" });
        }

        const participant = meeting.participants.find(
            (p) => p.user.toString() === userId
        );

        if (!participant) {
            return res.status(403).json({ message: "Access denied" });
        }

        meeting.joinCount += 1;
        meeting.lastJoinedAt = new Date();
        meeting.status = "ongoing";

        participant.status = "joined";

        await meeting.save();

        return res.status(200).json({
            success: true,
            meetingLink: meeting.videoCall.meetingLink,
            token: meeting.videoCall.participantToken
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


// ===============================
// ⏹ END MEETING
// ===============================
export const endMeetingController = async (req, res) => {
    try {
        const userId = req.user.id;
        const { meetingId } = req.params;

        const meeting = await Meeting.findById(meetingId);

        if (!meeting) {
            return res.status(404).json({ message: "Meeting not found" });
        }

        if (meeting.organizer.toString() !== userId) {
            return res.status(403).json({
                message: "Only organizer can end meeting"
            });
        }

        meeting.status = "completed";
        await meeting.save();

        return res.status(200).json({
            success: true,
            message: "Meeting ended",
            data: meeting
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


// ===============================
// ⭐ FEEDBACK
// ===============================
export const addFeedbackController = async (req, res) => {
    try {
        const userId = req.user.id;
        const { meetingId } = req.params;
        const { rating, comment } = req.body;

        const meeting = await Meeting.findById(meetingId);

        if (!meeting) {
            return res.status(404).json({ message: "Meeting not found" });
        }

        meeting.feedback.push({
            user: userId,
            rating,
            comment
        });

        await meeting.save();

        return res.status(200).json({
            success: true,
            message: "Feedback added",
            data: meeting
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};