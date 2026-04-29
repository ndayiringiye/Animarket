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
            participants = [],
            meetingType = "general",
            animalId,
            meetingDate,
            durationMinutes = 30,
            provider = "webrtc"
        } = req.body;

        const userId = req.user?.id;

     
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // 📌 2. BASIC VALIDATION
        if (!title || !meetingDate) {
            return res.status(400).json({
                message: "Title and meetingDate are required"
            });
        }

        if (!participants.length) {
            return res.status(400).json({
                message: "At least one participant is required"
            });
        }

      
        const organizer = await User.findById(userId);
        if (!organizer) {
            return res.status(404).json({ message: "Organizer not found" });
        }

       
        const uniqueParticipants = new Map();

        for (const p of participants) {
            if (!p.user || !p.role) {
                return res.status(400).json({
                    message: "Each participant must have user and role"
                });
            }

            if (uniqueParticipants.has(p.user)) continue;

            const user = await User.findById(p.user);
            if (!user) {
                return res.status(404).json({
                    message: `User not found: ${p.user}`
                });
            }

            uniqueParticipants.set(p.user, {
                user: user._id,
                role: p.role,
                status: "invited"
            });
        }

      
        if (!uniqueParticipants.has(userId)) {
            uniqueParticipants.set(userId, {
                user: organizer._id,
                role: organizer.role,
                status: "accepted"
            });
        }

        const validParticipants = Array.from(uniqueParticipants.values());

     
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

        let meetingLink = "";

        if (provider === "zoom") {

            meetingLink = `https://zoom.us/j/${meetingUUID}`;
        } else {
     
            meetingLink = `${process.env.FRONTEND_URL}/meeting/${meetingUUID}`;
        }

        const videoCall = {
            provider,
            meetingId: meetingUUID,
            meetingLink,
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
            durationMinutes,
            videoCall,
            status: "pending"
        });

        return res.status(201).json({
            success: true,
            message: "Meeting created successfully",
            data: meeting
        });

    } catch (error) {
        console.error("Create Meeting Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};