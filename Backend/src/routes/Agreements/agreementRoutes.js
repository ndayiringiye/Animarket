import express from "express";
import Agreement from "../../models/Agreement.js";

import { verifyToken } from "../../middleware/auth/verifyToken.js";
import { authorizeAgreementRole } from "../../middleware/auth/authorizeAgreementRole.js";

import { createAgreementService } from "../../services/agreementService.js";
import { signAgreement } from "../../services/signatureService.js";
import { releaseEscrowPayment } from "../../services/escrowService.js";

const router = express.Router();


// ─────────────────────────────
// 🧾 CREATE AGREEMENT
// ─────────────────────────────
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


// ─────────────────────────────
// ✍️ SIGN AGREEMENT
// ─────────────────────────────
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


// ─────────────────────────────
// ✅ COMPLETE AGREEMENT (RELEASE ESCROW)
// ─────────────────────────────
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