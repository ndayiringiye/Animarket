import express from "express";
import { verifyToken } from "../../Middlewares/Auth/authMiddleware.js";
import * as interestController from "../../controllers/Interest/interestController.js";

const router = express.Router();

router.post(
  "/request",
  verifyToken,
  interestController.createInterestRequest
);

router.get(
  "/my-requests",
  verifyToken,
  interestController.getUserInterestRequests
);

export default router;
