import * as bookingService from "../../services/bookings/bookingService.js";

export const createBooking = async (req, res) => {
  try {
    console.log('createBooking controller invoked for user:', req.user?.id);
    const result = await bookingService.createBookingService(
      req.body,
      req.user.id
    );

    return res.status(201).json({
      message: "Booking created successfully",
      status: 201,
      data: result,
    });
  } catch (error) {
    console.error("Create booking error:", error);

    return res.status(500).json({
      message: error.message,
      status: 500,
    });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const bookings = await bookingService.getUserBookingsService(
      req.user.id
    );

    return res.status(200).json({
      message: "Bookings retrieved successfully",
      status: 200,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: 500,
    });
  }
};

export const getSingleBooking = async (req, res) => {
  try {
    const booking = await bookingService.getSingleBookingService(
      req.params.bookingId
    );

    return res.status(200).json({
      message: "Booking retrieved successfully",
      status: 200,
      data: booking,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: 500,
    });
  }
};

export const initiatePayment = async (req, res) => {
  try {
    const booking = await bookingService.initiatePaymentService(
      req.params.bookingId
    );

    return res.status(200).json({
      message: "Payment initiated",
      status: 200,
      data: booking,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: 500,
    });
  }
};

export const holdEscrow = async (req, res) => {
  try {
    const booking = await bookingService.holdEscrowService(
      req.params.bookingId
    );

    return res.status(200).json({
      message: "Escrow holding payment",
      status: 200,
      data: booking,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: 500,
    });
  }
};

export const completeBooking = async (req, res) => {
  try {
    const booking = await bookingService.completeBookingService(
      req.params.bookingId
    );

    return res.status(200).json({
      message: "Booking completed",
      status: 200,
      data: booking,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: 500,
    });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const booking = await bookingService.cancelBookingService(
      req.params.bookingId
    );

    return res.status(200).json({
      message: "Booking cancelled",
      status: 200,
      data: booking,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: 500,
    });
  }
};