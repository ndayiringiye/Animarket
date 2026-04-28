import express from "express";

import {
  createAnimal,
  getAllAnimals,
  getAnimalById,
  updateAnimal,
  deleteAnimal
} from "../../controllers/animals/animalController.js";

import { verifyToken } from "../../middleware/auth/verifyToken.js";
import { protectRolePostAnimal } from "../../middleware/auth/protectRolePostAnimal.js";
import { isAdmin } from "../../middleware/auth/isAdmin.js";

const router = express.Router();

/**
 * ─────────────────────────────────────────────
 * 🐄 CREATE ANIMAL
 * seller | farmer only
 * ─────────────────────────────────────────────
 */
router.post(
  "/animal/register",
  verifyToken,
  protectRolePostAnimal,
  createAnimal
);

/**
 * ─────────────────────────────────────────────
 * 📦 GET ALL ANIMALS (PUBLIC MARKETPLACE)
 * ─────────────────────────────────────────────
 */
router.get(
  "/animals",
  getAllAnimals
);

/**
 * ─────────────────────────────────────────────
 * 🔍 GET SINGLE ANIMAL
 * ─────────────────────────────────────────────
 */
router.get(
  "/animals/:id",
  getAnimalById
);

/**
 * ─────────────────────────────────────────────
 * ✏️ UPDATE ANIMAL
 * seller | farmer only
 * ─────────────────────────────────────────────
 */
router.put(
  "/animals/:id",
  verifyToken,
  protectRolePostAnimal,
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
  getAllAnimals
);

export default router;