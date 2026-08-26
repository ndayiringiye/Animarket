import User from "../../models/users/UserModel.js";
import Animal from "../../models/animals/AnimalModel.js";
import Meeting from "../../models/Meetings/meettingModels.js";
import axios from "axios";

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

export const updateRealZoomMeeting = async (zoomMeetingId, updates) => {
    const token = await getZoomAccessToken();

    const payload = {};
    if (updates.title) payload.topic = updates.title;
    if (updates.meetingDate) payload.start_time = updates.meetingDate;
    if (updates.durationMinutes) payload.duration = updates.durationMinutes;
    if (updates.description) payload.agenda = updates.description;

    await axios.patch(
        `https://api.zoom.us/v2/meetings/${zoomMeetingId}`,
        payload,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        }
    );

    return true;
};

export const cancelRealZoomMeeting = async (zoomMeetingId) => {
    const token = await getZoomAccessToken();

    try {
        await axios.delete(
            `https://api.zoom.us/v2/meetings/${zoomMeetingId}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
    } catch (err) {
        // Zoom returns 404 if meeting already ended/deleted — treat as success
        if (err.response?.status !== 404) throw err;
    }

    return true;
};

export const createMeetingService = async (req) => {
    let {
        title, description, participants, meetingType, animalId,
        meetingDate, durationMinutes, provider = "webrtc", timezone, scheduledAt, note
    } = req.body;

    const userId = req.user.id;

    const organizer = await User.findById(userId);
    if (!organizer) throw new Error("Organizer not found");

    // Map fields from frontend if provided
    meetingDate = meetingDate || scheduledAt;
    description = description || note;

    let validParticipants = [];
    if (participants && participants.length > 0) {
        for (const p of participants) {
            const user = await User.findById(p.user);
            if (!user) throw new Error(`User not found: ${p.user}`);

            validParticipants.push({
                user: user._id,
                role: p.role,
                status: "invited"
            });
        }
    } else {
        // Customer reaches out to admin first
        const adminUser = await User.findOne({ role: "admin" });
        if (!adminUser) throw new Error("Admin not found to host the meeting");

        validParticipants.push({
            user: adminUser._id,
            role: "host",
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

export const grantNegotiationAccessService = async (meetingId, adminUserId, { farmerId, buyerId }) => {
    const admin = await User.findById(adminUserId);
    if (!admin || admin.role !== "admin") {
        throw new Error("Only admin can grant negotiation access");
    }

    const meeting = await Meeting.findById(meetingId);
    if (!meeting) throw new Error("Meeting not found");

    // Map each id to the role your schema already allows
    const entriesToAdd = [
        farmerId ? { id: farmerId, role: "farmer" } : null,
        buyerId ? { id: buyerId, role: "customer" } : null,
    ].filter(Boolean);

    for (const { id, role } of entriesToAdd) {
        const user = await User.findById(id);
        if (!user) throw new Error(`User not found: ${id}`);

        const alreadyIn = meeting.participants.find(p => p.user.toString() === id.toString());
        if (!alreadyIn) {
            meeting.participants.push({
                user: user._id,
                role,
                status: "invited"
            });
        }
    }

    meeting.negotiationAccessGranted = true;
    meeting.status = "pending"; // ready to be joined/started

    await meeting.save();
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

export const updateMeetingService = async (meetingId, userId, updates) => {
    const meeting = await Meeting.findById(meetingId);
    if (!meeting) throw new Error("Meeting not found");

    const requester = await User.findById(userId);
    const isAdmin = requester?.role === "admin";
    const isOrganizer = meeting.organizer.toString() === userId;

    if (!isAdmin && !isOrganizer) {
        throw new Error("Only admin or organizer can update the meeting");
    }

    if (meeting.videoCall?.provider === "zoom" && meeting.videoCall?.meetingId) {
        await updateRealZoomMeeting(meeting.videoCall.meetingId, updates);
    }

    if (updates.title) meeting.title = updates.title;
    if (updates.description) meeting.description = updates.description;
    if (updates.meetingDate) meeting.meetingDate = updates.meetingDate;
    if (updates.durationMinutes) meeting.durationMinutes = updates.durationMinutes;

    await meeting.save();
    return meeting;
};

export const cancelMeetingService = async (meetingId, userId) => {
    const meeting = await Meeting.findById(meetingId);
    if (!meeting) throw new Error("Meeting not found");

    const requester = await User.findById(userId);
    const isAdmin = requester?.role === "admin";
    const isOrganizer = meeting.organizer.toString() === userId;

    if (!isAdmin && !isOrganizer) {
        throw new Error("Only admin or organizer can cancel the meeting");
    }

    if (meeting.videoCall?.provider === "zoom" && meeting.videoCall?.meetingId) {
        await cancelRealZoomMeeting(meeting.videoCall.meetingId);
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