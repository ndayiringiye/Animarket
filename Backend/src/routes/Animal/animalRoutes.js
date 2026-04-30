import express from "express";

import {
  animalRegistering,
  getAnimals,
  getAnimalById,
  updateAnimal,
  deleteAnimal
} from "../../controllers/animals/animalController.js";

import { verifyToken } from "../../Middlewares/Auth/authMiddleware.js";
import { protectRolePostAnimal } from "../../utils/Roles/userRole.js";
import { isAdmin } from "../../Middlewares/Admin/amindMiddleware.js";

import upload from "../../controllers/upload/mediaController.js"; 

const router = express.Router();

/**
 * ─────────────────────────────────────────────
 * 🐄 CREATE ANIMAL (WITH FILE UPLOAD)
 * seller | farmer only
 * ─────────────────────────────────────────────
 */
router.post(
  "/animal/register",
  verifyToken,
  protectRolePostAnimal,
  upload.array("media", 5), // ✅ images/videos (max 5 files)
  animalRegistering
);

/**
 * ─────────────────────────────────────────────
 * 📦 GET ALL ANIMALS (PUBLIC MARKETPLACE)
 * ─────────────────────────────────────────────
 */
router.get("/animals", getAnimals);

/**
 * ─────────────────────────────────────────────
 * 🔍 GET SINGLE ANIMAL
 * ─────────────────────────────────────────────
 */
router.get("/animals/:id", getAnimalById);

/**
 * ─────────────────────────────────────────────
 * ✏️ UPDATE ANIMAL (WITH OPTIONAL FILE UPLOAD)
 * seller | farmer only
 * ─────────────────────────────────────────────
 */
router.put(
  "/animals/:id",
  verifyToken,
  protectRolePostAnimal,
  upload.array("media", 5), // ✅ allow replacing/adding media
  updateAnimal
);

/**
 * ─────────────────────────────────────────────
 * 🗑 DELETE ANIMAL
 * seller | farmer only
 * ─────────────────────────────────────────────
 */
router.delete(
  "/animals/:id",
  verifyToken,
  protectRolePostAnimal,
  deleteAnimal
);

/**
 * ─────────────────────────────────────────────
 * 🔐 ADMIN ONLY ROUTE
 * Get all animals (admin dashboard)
 * ─────────────────────────────────────────────
 */
router.get(
  "/admin/animals",
  verifyToken,
  isAdmin,
  getAnimals
);

export default router;