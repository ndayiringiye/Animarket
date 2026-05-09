import User from "../../models/users/UserModel.js";
import Animal from "../../models/animals/AnimalModel.js";
import Meeting from "../../models/Meetings/meettingModels.js";

import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";

let cachedToken = null;
let tokenExpiry = null;

const getZoomAccessToken = async () => {
    if (cachedToken && tokenExpiry > Date.now()) {
        return cachedToken;
    }

    const auth = Buffer.from(
        `${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`
    ).toString("base64");

    const response = await axios.post(
        "https://zoom.us/oauth/token",
        null,
        {
            params: {
                grant_type: "account_credentials",
                account_id: process.env.ZOOM_ACCOUNT_ID,
            },
            headers: {
                Authorization: `Basic ${auth}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
        }
    );

    cachedToken = response.data.access_token;
    tokenExpiry = Date.now() + (response.data.expires_in * 1000 - 300000); // 5 min buffer

    return cachedToken;
};

export const createRealZoomMeeting = async (details) => {
    const token = await getZoomAccessToken();

    const payload = {
        topic: details.title,
        type: 2, // Scheduled
        start_time: details.meetingDate,
        duration: details.durationMinutes || 30,
        timezone: details.timezone || "Africa/Kigali",
        agenda: details.description,
        settings: {
            host_video: true,
            participant_video: true,
            join_before_host: false,
            mute_upon_entry: true,
            waiting_room: true,
            auto_recording: "none",
        }
    };

    const response = await axios.post(
        "https://api.zoom.us/v2/users/me/meetings",
        payload,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        }
    );

    const zoom = response.data;

    return {
        meetingId: zoom.id.toString(),
        meetingLink: zoom.join_url,
        startUrl: zoom.start_url,
        password: zoom.password,
        zoomMeetingData: zoom
    };
};


export const createMeetingService = async (req) => {
    const {
        title, description, participants, meetingType, animalId,
        meetingDate, durationMinutes, provider = "webrtc", timezone
    } = req.body;

    const userId = req.user.id;

    const organizer = await User.findById(userId);
    if (!organizer) throw new Error("Organizer not found");

    if (!participants || participants.length === 0) {
        throw new Error("Participants are required");
    }

    const validParticipants = [];
    for (const p of participants) {
        const user = await User.findById(p.user);
        if (!user) throw new Error(`User not found: ${p.user}`);

        validParticipants.push({
            user: user._id,
            role: p.role,
            status: "invited"
        });
    }

    let animal = null;
    if (animalId) {
        animal = await Animal.findById(animalId);
        if (!animal) throw new Error("Animal not found");
    }

    let videoCall = {
        provider,
        meetingId: uuidv4(),
        hostToken: crypto.randomBytes(16).toString("hex"),
        participantToken: crypto.randomBytes(16).toString("hex"),
    };

    let zoomMeetingData = null;

    if (provider === "zoom") {
        const zoomResult = await createRealZoomMeeting({
            title, description, meetingDate, durationMinutes, timezone
        });
        videoCall = { ...videoCall, ...zoomResult };
        zoomMeetingData = zoomResult.zoomMeetingData;
    } else {
        videoCall.meetingLink = `${process.env.FRONTEND_URL}/meeting/${videoCall.meetingId}`;
    }

    const meeting = await Meeting.create({
        title,
        description,
        organizer: userId,
        organizerType: "user",
        participants: validParticipants,
        meetingType,
        animal: animal?._id,
        meetingDate,
        durationMinutes: durationMinutes || 30,
        timezone: timezone || "Africa/Kigali",
        videoCall,
        zoomMeetingData,
        status: "pending"
    });

    return meeting;
};

export const startMeetingService = async (meetingId, userId) => {
    const meeting = await Meeting.findById(meetingId);
    if (!meeting) throw new Error("Meeting not found");

    if (meeting.organizer.toString() !== userId) {
        throw new Error("Only organizer can start the meeting");
    }

    meeting.status = "ongoing";
    meeting.lastJoinedAt = new Date();
    await meeting.save();

    return meeting;
};

export const cancelMeetingService = async (meetingId, userId) => {
    const meeting = await Meeting.findById(meetingId);
    if (!meeting) throw new Error("Meeting not found");

    if (meeting.organizer.toString() !== userId) {
        throw new Error("Only organizer can cancel the meeting");
    }

    meeting.status = "cancelled";
    await meeting.save();

    return meeting;
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

    const participant = meeting.participants.find(p => p.user.toString() === userId);
    if (!participant) throw new Error("Not invited");

    participant.status = "accepted";
    await meeting.save();
    return meeting;
};

export const joinMeetingService = async (meetingId, userId) => {
    const meeting = await Meeting.findById(meetingId);
    if (!meeting) throw new Error("Meeting not found");

    const participant = meeting.participants.find(p => p.user.toString() === userId);
    if (!participant) throw new Error("Access denied");

    meeting.joinCount += 1;
    meeting.lastJoinedAt = new Date();
    meeting.status = "ongoing";
    participant.status = "joined";

    await meeting.save();

    return {
        meetingLink: meeting.videoCall.meetingLink,
        startUrl: meeting.videoCall.startUrl,
        password: meeting.videoCall.password,
        token: meeting.videoCall.participantToken,
        provider: meeting.videoCall.provider
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