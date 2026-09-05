import express from "express";
import { verifyToken } from "../../Middlewares/Auth/authMiddleware.js";
import * as chatController from "../../controllers/Chat/chatController.js";

const router = express.Router();

// Customer fetches conversation for a specific animal
router.get(
  "/messages/:animalId",
  verifyToken,
  chatController.getMessages
);

// Customer sends a message to the farmer (animal owner)
router.post(
  "/messages",
  verifyToken,
  chatController.sendMessage
);

// Farmer fetches all conversation threads grouped by animal+customer
router.get(
  "/farmer-messages",
  verifyToken,
  chatController.getFarmerMessages
);

// Farmer sends a reply to a customer
router.post(
  "/reply",
  verifyToken,
  chatController.sendReply
);

export default router;
