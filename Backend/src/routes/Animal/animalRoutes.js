import express from "express";

import {
  animalRegistering,
  getAnimals,
  getSingleAnimal,
  updateAnimalController,
  deleteAnimalController
} from "../../controllers/animals/animalController.js";

import { verifyToken } from "../../Middlewares/Auth/authMiddleware.js";
import { protectRolePostAnimal } from "../../utils/Roles/userRole.js";
import { isAdmin } from "../../Middlewares/Admin/amindMiddleware.js";

import { upload } from "../../controllers/upload/mediaController.js";

const router = express.Router();

router.post(
  "/animal/register",
  verifyToken,
  protectRolePostAnimal,
  upload.array("media", 5),
  animalRegistering
);

router.get("/animals", getAnimals);
router.get("/animals/:id", getSingleAnimal);

router.put(
  "/animals/:id",
  verifyToken,
  protectRolePostAnimal,
  upload.array("media", 5),
  updateAnimalController
);

router.delete(
  "/animals/:id",
  verifyToken,
  protectRolePostAnimal,
  deleteAnimalController
);

router.get(
  "/admin/animals",
  verifyToken,
  isAdmin,
  getAnimals
);

export default router;