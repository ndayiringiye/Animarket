import express from "express";
import { verifyToken } from "../../Middlewares/Auth/authMiddleware.js";
import * as trustController from "../../controllers/Trust/trustController.js";

const router = express.Router();

router.get(
  "/verify/:userId",
  verifyToken,
  trustController.verifyTrustScore
);

export default router;
