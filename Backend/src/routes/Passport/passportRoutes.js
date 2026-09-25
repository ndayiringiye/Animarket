import express from "express";
import { verifyToken } from "../../Middlewares/Auth/authMiddleware.js";
import { isAdmin } from "../../Middlewares/Admin/amindMiddleware.js";
import * as passportController from "../../controllers/Passport/passportController.js";

const router = express.Router();

router.get("/admin/list", verifyToken, isAdmin, passportController.listPassports);

router.put(
  "/admin/delivery/:source/:bookingId",
  verifyToken,
  isAdmin,
  passportController.updatePassportDeliveryStatus
);

router.get("/public/:animalId", passportController.getPublicPassport);

export default router;
