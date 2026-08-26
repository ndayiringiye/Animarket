import * as deliveryService from "../../services/Delivery/deliveryService.js";

export const requestDelivery = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.id;
    const data = req.body;

    const booking = await deliveryService.requestDeliveryService(
      bookingId,
      userId,
      data
    );

    return res.status(200).json({
      success: true,
      message: "Delivery requested successfully",
      data: booking,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getDeliveryStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const deliveryInfo = await deliveryService.getDeliveryStatusService(
      bookingId
    );

    return res.status(200).json({
      success: true,
      data: deliveryInfo,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};
