import Booking from "../../models/Bookings/bookingModel.js";
import User from "../../models/users/UserModel.js";
import Animal from "../../models/animals/AnimalModel.js";
import Meeting from "../../models/Meetings/meettingModels.js";
import { createAgreementService } from "../Agreements/agreementService.js";

import QRCode from "qrcode";
import nodemailer from "nodemailer";
import dotenv from "dotenv"
dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const createBookingService = async (data, userId) => {
    try {
        const {
            animalId,
            meetingId,
            negotiatedPrice,
            paymentMethod,
            deliveryOption,
            deliveryAddress
        } = data;
        const buyer = await User.findById(userId);
        if (!buyer) throw new Error("Buyer not found")

        const animal = await Animal.findById(animalId).populate("owner");
        if (!animal) throw new Error("Animal not found");

        // The farmer who owns the animal is the actual seller of record
        // Map the animal.owner to the booking.farmer. If the owner User
        // document is missing, still proceed using the owner ObjectId so
        // existing animal records without a User document don't block bookings.
        let farmer = animal.owner;
        let farmerRef;
        let farmerEmail;
        if (farmer && farmer._id) {
            // populated User document
            farmerRef = farmer._id;
            farmerEmail = farmer.email;
        } else {
            // owner may be an ObjectId; try to fetch the User, but don't fail if missing
            const lookedUp = farmer ? await User.findById(farmer) : null;
            if (lookedUp) {
                farmerRef = lookedUp._id;
                farmerEmail = lookedUp.email;
            } else {
                // populate returned falsy (no User doc). retrieve raw owner id from DB
                const raw = await Animal.findById(animalId).select("owner").lean();
                const rawOwner = raw?.owner;
                farmerRef = rawOwner || farmer;
                farmerEmail = farmerRef ? String(farmerRef) : null;
            }
        }

        // Admin still handles commission/escrow oversight, tracked separately from farmer
        const adminUser = await User.findOne({ role: "admin" });
        if (!adminUser) throw new Error("Admin not found to handle booking");

        let meeting = null;
        if (meetingId) {
            meeting = await Meeting.findById(meetingId);
            if (!meeting) throw new Error("Meeting not found");
        }

        const finalPrice = negotiatedPrice || animal.price;

        const booking = await Booking.create({
            // only set customer/farmer as required by schema
            customer: buyer._id,
            farmer: farmerRef,
            animal: animal._id,
            meeting: meeting?._id,
            price: finalPrice,
            negotiatedPrice,
            paymentMethod,
            deliveryOption,
            deliveryAddress,
            status: "pending",
            paymentStatus: "pending"
        });

        // Admin owns the creation step, while both booking parties can review and sign.
        const agreement = await createAgreementService({
            bookingId: booking._id,
            animalId: animal._id,
            customerId: buyer._id,
            farmerId: farmerRef,
            price: finalPrice,
            paymentMethod,
            deliveryDate: booking.deliveryDate,
            createdBy: adminUser._id,
        });

        const qrPayload = {
            bookingId: booking._id,
            bookingNumber: booking.bookingNumber,
            animalId: animal._id,
            buyer: buyer.email,
            seller: farmerEmail,
            amount: finalPrice,
            status: booking.status
        };

        const qrCodeImage = await QRCode.toDataURL(
            JSON.stringify(qrPayload)
        );

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: buyer.email,
            subject: "AniMarket Booking Confirmation",
            html: `
                <h2>Booking Confirmed</h2>
                <p><strong>Booking No:</strong> ${booking.bookingNumber}</p>
                <p><strong>Animal:</strong> ${animal.name || "Livestock"}</p>
                <p><strong>Amount:</strong> ${finalPrice} ${booking.currency}</p>
                <p>Status: ${booking.status}</p>

                <p>Scan QR Code for verification:</p>
                <img src="${qrCodeImage}" />
            `
        };

        await transporter.sendMail(mailOptions);

        return {
            booking,
            agreement,
            qrCode: qrCodeImage
        };

    } catch (error) {
        throw error;
    }
};



export const getUserBookingsService = async (userId) => {
    return await Booking.find({
        $or: [
            { customer: userId },
            { farmer: userId }
        ]
    })
        .populate("customer", "name email")
        .populate("farmer", "name email")
        .populate("animal")
        .populate("meeting")
        .sort({ createdAt: -1 });
};



export const getSingleBookingService = async (bookingId) => {
    const booking = await Booking.findById(bookingId)
        .populate("customer")
        .populate("farmer")
        .populate("animal")
        .populate("meeting");

    if (!booking) throw new Error("Booking not found");

    return booking;
};


export const initiatePaymentService = async (bookingId) => {
    const booking = await Booking.findById(bookingId);

    if (!booking) throw new Error("Booking not found");

    booking.paymentStatus = "initiated";
    booking.status = "in_progress";

    await booking.save();

    return booking;
};


export const holdEscrowService = async (bookingId) => {
    const booking = await Booking.findById(bookingId);

    booking.paymentStatus = "held_in_escrow";
    booking.escrowStatus = "holding";

    await booking.save();

    return booking;
};


export const completeBookingService = async (bookingId) => {
    const booking = await Booking.findById(bookingId);

    booking.status = "completed";
    booking.paymentStatus = "paid";
    booking.escrowStatus = "released";
    booking.isPaid = true;
    booking.isDelivered = true;

    await booking.save();

    return booking;
};



export const cancelBookingService = async (bookingId) => {
    const booking = await Booking.findById(bookingId);

    booking.status = "cancelled";

    await booking.save();

    return booking;
};
