import express from "express";
import Agreement from "../../models/Agreements/agreementModel.js";

import { verifyToken } from "../../Middlewares/Auth/authMiddleware.js";

import { createAgreementService, refreshAgreementPdf } from "../../services/Agreements/agreementService.js";
import { signAgreement } from "../../services/signals/signatureService.js";
import { releaseEscrowPayment } from "../../services/score/escrowService.js";
import { sendAgreementEmail } from "../../services/emails/emailService.js";
import User from "../../models/users/UserModel.js";

const router = express.Router();


router.post(
  "/agreements",
  verifyToken,
  async (req, res) => {
    try {
      const result = await createAgreementService({
        ...req.body,
        customerId: req.user._id,
        createdBy: req.user.id,
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

router.get("/agreements/animal/:animalId", verifyToken, async (req, res) => {
  try {
    const partyFields = ["parties.customer", "parties.farmer", "parties.hotel"];
    const agreement = await Agreement.findOne({
      "animal.animalId": req.params.animalId,
      $or: partyFields.map((field) => ({ [field]: req.user._id })),
    }).sort({ createdAt: -1 });

    if (!agreement) {
      return res.status(404).json({ message: "Agreement not found" });
    }

    res.json({ success: true, data: agreement });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/agreements/my-agreements", verifyToken, async (req, res) => {
  try {
    const agreements = await Agreement.find({
      $or: [
        { "parties.customer": req.user._id },
        { "parties.farmer": req.user._id },
      ],
    })
      .populate("parties.customer", "name email")
      .populate("parties.farmer", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: agreements });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



router.put("/agreements/:id/sign", verifyToken, async (req, res) => {
  try {
    const { signature } = req.body;

    const agreement = await Agreement.findById(req.params.id);

    if (!agreement) {
      return res.status(404).json({ message: "Agreement not found" });
    }

    const isParty = [agreement.parties.customer, agreement.parties.farmer, agreement.parties.hotel]
      .filter(Boolean)
      .some((partyId) => partyId.toString() === req.user._id.toString());
    if (!isParty) {
      return res.status(403).json({ message: "Only agreement parties can sign" });
    }

    if (typeof signature !== "string" || !signature.trim()) {
      return res.status(400).json({ message: "A digital signature is required" });
    }

    const wasFarmerUnsigned = !agreement.signatures?.farmer;
    signAgreement(agreement, req.user, signature.trim());
    if ((agreement.signatures.customer && agreement.signatures.farmer) || (agreement.signatures.hotel && agreement.signatures.farmer)) {
      agreement.status = "accepted";
    }

    await agreement.save();

    const fullySignedByFarmer = wasFarmerUnsigned && agreement.signatures?.customer && agreement.signatures?.farmer;
    if (fullySignedByFarmer) {
      const signedAgreement = await refreshAgreementPdf(agreement._id);
      const customer = await User.findById(agreement.parties.customer).select("email");
      if (customer?.email && signedAgreement.pdfUrl) {
        await sendAgreementEmail([customer.email], signedAgreement.pdfUrl, signedAgreement.transactionId);
      }
      agreement.pdfUrl = signedAgreement.pdfUrl;
    }

    res.json({
      success: true,
      message: "Agreement signed",
      data: agreement,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/agreements/:id/price", verifyToken, async (req, res) => {
  try {
    const { price } = req.body;
    if (typeof price !== "number" || price < 0) {
      return res.status(400).json({ message: "A valid price is required" });
    }

    const agreement = await Agreement.findById(req.params.id);
    if (!agreement) return res.status(404).json({ message: "Agreement not found" });

    const isParty = [agreement.parties.customer, agreement.parties.farmer]
      .filter(Boolean)
      .some((partyId) => partyId.toString() === req.user._id.toString());
    if (req.user.role !== "admin" && !isParty) {
      return res.status(403).json({ message: "Only agreement parties can update the price" });
    }

    if (agreement.signatures.customer || agreement.signatures.farmer) {
      return res.status(409).json({ message: "Price cannot be changed after signing" });
    }

    agreement.price = price;
    await agreement.save();
    res.json({ success: true, message: "Agreement price updated", data: agreement });
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
