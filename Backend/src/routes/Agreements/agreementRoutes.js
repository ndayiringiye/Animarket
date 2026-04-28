import express from "express";

import {
  createAgreementService
} from "../../services/agreementService.js";

import Agreement from "../../models/Agreement.js";

import { verifyToken } from "../../middleware/auth/verifyToken.js";
import { isAdmin } from "../../middleware/auth/isAdmin.js";

const router = express.Router();


// ─────────────────────────────────────────────
// 🧾 CREATE AGREEMENT (SALE / VET / JOB REQUEST)
// ─────────────────────────────────────────────
router.post("/agreements", verifyToken, async (req, res) => {
  try {
    const {
      type,
      buyerId,
      sellerId,
      vetId,
      requesterId,
      animalId,
      paymentMethod,
      deliveryDate,
      service
    } = req.body;

    const result = await createAgreementService({
      type,
      buyerId,
      sellerId,
      vetId,
      requesterId,
      animalId,
      paymentMethod,
      deliveryDate,
      service,
    });

    res.status(201).json({
      success: true,
      message: "Agreement created successfully",
      data: result,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


router.get("/agreements", verifyToken, async (req, res) => {
  try {
    const agreements = await Agreement.find()
      .populate("parties.buyer")
      .populate("parties.seller")
      .populate("parties.veterinarian")
      .populate("animal.animalId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: agreements.length,
      data: agreements,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});



router.get("/agreements/:id", verifyToken, async (req, res) => {
  try {
    const agreement = await Agreement.findById(req.params.id)
      .populate("parties.buyer")
      .populate("parties.seller")
      .populate("parties.veterinarian")
      .populate("animal.animalId");

    if (!agreement) {
      return res.status(404).json({
        success: false,
        message: "Agreement not found",
      });
    }

    res.status(200).json({
      success: true,
      data: agreement,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});



router.put("/agreements/:id/status", verifyToken, async (req, res) => {
  try {
    const { status } = req.body;

    const agreement = await Agreement.findByIdAndUpdate(
      req.params.id,
      { status, updatedBy: req.user.id },
      { new: true }
    );

    if (!agreement) {
      return res.status(404).json({
        success: false,
        message: "Agreement not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Agreement status updated",
      data: agreement,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


// ─────────────────────────────────────────────
// 🧾 DELETE AGREEMENT (ADMIN ONLY)
// ─────────────────────────────────────────────
router.delete("/agreements/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const agreement = await Agreement.findByIdAndDelete(req.params.id);

    if (!agreement) {
      return res.status(404).json({
        success: false,
        message: "Agreement not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Agreement deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;