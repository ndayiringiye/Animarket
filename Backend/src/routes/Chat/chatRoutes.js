import express from "express";
import { verifyToken } from "../../Middlewares/Auth/authMiddleware.js";
import * as chatController from "../../controllers/Chat/chatController.js";

const router = express.Router();

router.get(
  "/messages/:animalId",
  verifyToken,
  chatController.getMessages
);

router.post(
  "/messages",
  verifyToken,
  chatController.sendMessage
);

export default router;
