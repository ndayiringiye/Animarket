import * as passportService from "../../services/Passport/passportService.js";

export const listPassports = async (req, res) => {
  try {
    const data = await passportService.listPassportsService();
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePassportDeliveryStatus = async (req, res) => {
  try {
    const { source, bookingId } = req.params;
    const { status } = req.body;
    if (!status) throw new Error("Status is required");

    const updated = await passportService.updatePassportDeliveryStatusService(
      source,
      bookingId,
      status
    );

    return res.status(200).json({ success: true, message: "Status updated", data: updated });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getPublicPassport = async (req, res) => {
  try {
    const data = await passportService.getPublicPassportService(req.params.animalId);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(404).json({ success: false, message: error.message });
  }
};
