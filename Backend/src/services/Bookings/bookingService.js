import Booking from "../../models/bookings/BookingModel.js";
import User from "../../models/users/UserModel.js";
import Animal from "../../models/animals/AnimalModel.js";
import Meeting from "../../models/Meetings/meettingModels.js";

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

        const seller = animal.owner;
        if (!seller) throw new Error("Seller not found");

     
        let meeting = null;
        if (meetingId) {
            meeting = await Meeting.findById(meetingId);
            if (!meeting) throw new Error("Meeting not found");
        }

        const finalPrice = negotiatedPrice || animal.price;

  
        const booking = await Booking.create({
            buyer: buyer._id,
            seller: seller._id,
            animal: animal._id,
            meeting: meeting?._id,
            price: animal.price,
            negotiatedPrice,
            paymentMethod,
            deliveryOption,
            deliveryAddress,
            status: "pending",
            paymentStatus: "pending"
        });

        const qrPayload = {
            bookingId: booking._id,
            bookingNumber: booking.bookingNumber,
            animalId: animal._id,
            buyer: buyer.email,
            seller: seller.email,
            amount: finalPrice,
            status: booking.status
        };

        const qrCodeImage = await QRCode.toDataURL(
            JSON.stringify(qrPayload)
        );

       
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: buyer.email,
            subject: "🐄 AniMarket Booking Confirmation",
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
            qrCode: qrCodeImage
        };

    } catch (error) {
        throw error;
    }
};



export const getUserBookingsService = async (userId) => {
    return await Booking.find({
        $or: [
            { buyer: userId },
            { seller: userId }
        ]
    })
        .populate("buyer", "name email")
        .populate("seller", "name email")
        .populate("animal")
        .populate("meeting")
        .sort({ createdAt: -1 });
};



export const getSingleBookingService = async (bookingId) => {
    const booking = await Booking.findById(bookingId)
        .populate("buyer")
        .populate("seller")
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