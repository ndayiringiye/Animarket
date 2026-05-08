import User from "../../models/users/UserModel.js";
import Animal from "../../models/animals/AnimalModel.js";
import Meeting from "../../models/meetings/MeetingModel.js";

import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";


export const createMeetingService = async (req, res) => {
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

        const userId = req.user.id;

        
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
                return res.status(404).json({ message: `User not found: ${p.user}` });
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

        let videoCall = {
            provider: provider || "webrtc",
            meetingId: meetingUUID,
            meetingLink: "",
            hostToken: "",
            participantToken: ""
        };

        if (provider === "zoom") {
        
            videoCall.meetingLink = `https://zoom.us/j/${meetingUUID}`;
            videoCall.hostToken = crypto.randomBytes(16).toString("hex");
            videoCall.participantToken = crypto.randomBytes(16).toString("hex");
        } else {
           
            videoCall.meetingLink = `${process.env.FRONTEND_URL}/meeting/${meetingUUID}`;
            videoCall.hostToken = crypto.randomBytes(16).toString("hex");
            videoCall.participantToken = crypto.randomBytes(16).toString("hex");
        }

        
        const meeting = await Meeting.create({
            title,
            description,
            organizer: organizer._id,
            participants: validParticipants,
            meetingType,
            animal: animal?._id,
            meetingDate,
            durationMinutes,

            videoCall,

            status: "pending"
        });

        return res.status(201).json({
            message: "Meeting created successfully",
            meeting
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", error });
    }
};


export const getUserMeetingsService = async (userId) => {
    return await Meeting.find({
        $or: [
            { organizer: userId },
            { "participants.user": userId }
        ]
    })
    .populate("organizer", "name email")
    .populate("participants.user", "name email")
    .populate("animal");
};

export const getSingleMeetingService = async (meetingId) => {
    const meeting = await Meeting.findById(meetingId)
        .populate("organizer")
        .populate("participants.user")
        .populate("animal");

    if (!meeting) throw new Error("Meeting not found");

    return meeting;
};

export const acceptMeetingService = async (meetingId, userId) => {
    const meeting = await Meeting.findById(meetingId);
    if (!meeting) throw new Error("Meeting not found");

    const participant = meeting.participants.find(
        (p) => p.user.toString() === userId
    );

    if (!participant) throw new Error("Not invited");

    participant.status = "accepted";
    await meeting.save();

    return meeting;
};

export const joinMeetingService = async (meetingId, userId) => {
    const meeting = await Meeting.findById(meetingId);

    if (!meeting) throw new Error("Meeting not found");

    const participant = meeting.participants.find(
        (p) => p.user.toString() === userId
    );

    if (!participant) throw new Error("Access denied");

    meeting.joinCount += 1;
    meeting.lastJoinedAt = new Date();
    meeting.status = "ongoing";

    participant.status = "joined";

    await meeting.save();

    return {
        meetingLink: meeting.videoCall.meetingLink,
        token: meeting.videoCall.participantToken
    };
};

export const endMeetingService = async (meetingId, userId) => {
    const meeting = await Meeting.findById(meetingId);

    if (!meeting) throw new Error("Meeting not found");

    if (meeting.organizer.toString() !== userId) {
        throw new Error("Only organizer can end meeting");
    }

    meeting.status = "completed";
    await meeting.save();

    return meeting;
};

export const addFeedbackService = async (meetingId, userId, data) => {
    const meeting = await Meeting.findById(meetingId);

    if (!meeting) throw new Error("Meeting not found");

    meeting.feedback.push({
        user: userId,
        rating: data.rating,
        comment: data.comment
    });

    await meeting.save();

    return meeting;
};

const getZoomAccessToken = async () => {
    const auth = Buffer.from(`${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`).toString('base64');
    const response = await axios.post(
        `https://zoom.us{process.env.ZOOM_ACCOUNT_ID}`,
        {},
        { headers: { Authorization: `Basic ${auth}` } }
    );
    return response.data.access_token;
};

const createZoomMeeting = async (meetingDetails) => {
    const token = await getZoomAccessToken();
    const response = await axios.post(
        "https://zoom.us",
        {
            topic: meetingDetails.title,
            type: 2, // Scheduled meeting
            start_time: meetingDetails.meetingDate,
            duration: meetingDetails.durationMinutes,
            agenda: meetingDetails.description,
            settings: {
                host_video: true,
                participant_video: true,
                join_before_host: false,
                waiting_room: true
            }
        },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data; // This contains the real join_url and meeting password
};
