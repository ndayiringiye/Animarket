import express from "express";
import { verifyToken } from "../../Middlewares/Auth/authMiddleware.js";
import * as deliveryController from "../../controllers/Delivery/deliveryController.js";

const router = express.Router();

router.put(
  "/request/:bookingId",
  verifyToken,
  deliveryController.requestDelivery
);

router.put(
  "/hotel-request/:bookingId",
  verifyToken,
  deliveryController.requestHotelDelivery
);

router.get(
  "/status/:bookingId",
  verifyToken,
  deliveryController.getDeliveryStatus
);

export default router;
