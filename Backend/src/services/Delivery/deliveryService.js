import Booking from "../../models/Bookings/bookingModel.js";

export const requestDeliveryService = async (bookingId, userId, data) => {
  const { address, deliveryDate, notes } = data;

  const booking = await Booking.findById(bookingId);
  if (!booking) throw new Error("Booking not found");

  // Verify the user is the customer of this booking
  if (booking.customer?.toString() !== userId) {
    throw new Error("You are not authorized to request delivery for this booking");
  }

  booking.deliveryOption = "platform_delivery";
  booking.deliveryAddress = {
    address: address || booking.deliveryAddress?.address,
    latitude: booking.deliveryAddress?.latitude,
    longitude: booking.deliveryAddress?.longitude,
  };
  booking.deliveryDate = deliveryDate || booking.deliveryDate;
  booking.deliveryStatus = "scheduled";
  booking.deliveryRequestedAt = new Date();

  booking.trackingHistory.push({
    status: "scheduled",
    message: notes || "Delivery requested by customer",
    updatedBy: userId,
    timestamp: new Date(),
  });

  await booking.save();
  return booking;
};

export const getDeliveryStatusService = async (bookingId) => {
  const booking = await Booking.findById(bookingId)
    .populate("customer", "name email phone")
    .populate("farmer", "name email phone");

  if (!booking) throw new Error("Booking not found");

  return {
    bookingId: booking._id,
    bookingNumber: booking.bookingNumber,
    deliveryOption: booking.deliveryOption,
    deliveryAddress: booking.deliveryAddress,
    deliveryStatus: booking.deliveryStatus,
    deliveryDate: booking.deliveryDate,
    deliveryRequestedAt: booking.deliveryRequestedAt,
    isDelivered: booking.isDelivered,
    trackingHistory: booking.trackingHistory,
  };
};
