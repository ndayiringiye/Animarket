import Joi from "joi";

const objectIdSchema = Joi.string().hex().length(24).required();

const meetingValidationSchema = Joi.object({
    title: Joi.string().min(3).max(150).trim().required()
        .messages({ "string.empty": "Title is required" }),

    description: Joi.string().max(1000).trim().allow(""),

    participants: Joi.array().items(
        Joi.object({
            user: objectIdSchema,
            role: Joi.string().valid("seller", "admin", "customer", "farmer", "veterinary", "hotel").required()
        })
    ).min(1).optional()
        .messages({ "array.min": "At least one participant is required" }),

    meetingType: Joi.string().valid(
        "animal_inspection",
        "transaction_discussion",
        "vet_consultation",
        "delivery_planning",
        "dispute_resolution",
        "general"
    ).default("general"),

    animalId: objectIdSchema.allow(null, ""),

    meetingDate: Joi.date().greater("now").required()
        .messages({ "date.greater": "Meeting date must be in the future" }),

    durationMinutes: Joi.number().integer().min(5).max(480).default(30),

    provider: Joi.string().valid("webrtc", "zoom", "google_meet", "custom").default("webrtc"),

    timezone: Joi.string().default("Africa/Kigali")
});

const paramsIdSchema = Joi.object({
    meetingId: objectIdSchema
});

const feedbackSchema = Joi.object({
    rating: Joi.number().integer().min(1).max(5).required(),
    comment: Joi.string().max(500).trim().allow("")
});

export const validateCreateMeeting = (req, res, next) => {
    const { error } = meetingValidationSchema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({
            success: false,
            message: "Validation Error",
            errors: error.details.map(err => err.message)
        });
    }
    next();
};

export const validateMeetingId = (req, res, next) => {
    const { error } = paramsIdSchema.validate(req.params);
    if (error) {
        return res.status(400).json({
            success: false,
            message: "Invalid Meeting ID"
        });
    }
    next();
};

export const validateFeedback = (req, res, next) => {
    const { error } = feedbackSchema.validate(req.body);
    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        });
    }
    next();
};