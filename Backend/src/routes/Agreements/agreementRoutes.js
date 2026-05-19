import express from "express";
import Agreement from "../../models/Agreements/agreementModel.js";

import { verifyToken } from "../../Middlewares/Auth/authMiddleware.js";
import { authorizeAgreementRole } from "../../Middlewares/Auth/authorizationAgreement.js";

import { createAgreementService } from "../../services/Agreements/agreementService.js";
import { signAgreement } from "../../services/signals/signatureService.js";
import { releaseEscrowPayment } from "../../services/score/escrowService.js";

const router = express.Router();


router.post(
  "/agreements",
  verifyToken,
  authorizeAgreementRole("buyer", "farmer", "veterinary"),
  async (req, res) => {
    try {
      const result = await createAgreementService({
        ...req.body,
        buyerId: req.user.id,
      });

      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);



router.put("/agreements/:id/sign", verifyToken, async (req, res) => {
  try {
    const { signature } = req.body;

    const agreement = await Agreement.findById(req.params.id);

    if (!agreement) {
      return res.status(404).json({ message: "Agreement not found" });
    }

    signAgreement(agreement, req.user, signature);

    await agreement.save();

    res.json({
      success: true,
      message: "Agreement signed",
      data: agreement,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



router.put(
  "/agreements/:id/complete",
  verifyToken,
  async (req, res) => {
    try {
      const agreement = await Agreement.findById(req.params.id);

      if (!agreement) {
        return res.status(404).json({ message: "Not found" });
      }

      await releaseEscrowPayment(agreement);

      agreement.status = "completed";
      await agreement.save();

      res.json({
        success: true,
        message: "Agreement completed & payment released",
        data: agreement,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

export default router;