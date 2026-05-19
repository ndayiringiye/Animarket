import express from "express";
import * as bookingController from "../../controllers/Booking/BookingAnimal.js";
import { verifyToken } from "../../Middlewares/Auth/authMiddleware.js";

const router = express.Router();

router.post(
  "/create",
  verifyToken,
  bookingController.createBooking
);

router.get(
  "/my-bookings",
  verifyToken,
  bookingController.getUserBookings
);

router.get(
  "/:bookingId",
  verifyToken,
  bookingController.getSingleBooking
);

router.put(
  "/:bookingId/initiate-payment",
  verifyToken,
  bookingController.initiatePayment
);

router.put(
  "/:bookingId/hold-escrow",
  verifyToken,
  bookingController.holdEscrow
);

router.put(
  "/:bookingId/complete",
  verifyToken,
  bookingController.completeBooking
);

router.put(
  "/:bookingId/cancel",
  verifyToken,
  bookingController.cancelBooking
);

export default router;