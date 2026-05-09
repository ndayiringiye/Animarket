import express from "express";

import {
  animalRegistering,
  getAnimals,
  getSingleAnimal,
  updateAnimalController,
  deleteAnimalController,
  deleteAnimalMediaController
} from "../../controllers/animals/animalController.js";

import { verifyToken } from "../../Middlewares/Auth/authMiddleware.js";
import { protectRolePostAnimal } from "../../utils/Roles/userRole.js";
import { isAdmin } from "../../Middlewares/Admin/amindMiddleware.js";

import upload  from "../../Middlewares/user/uplaodMiddleware.js"; 

const router = express.Router();

router.post(
  "/register",
  verifyToken,
  protectRolePostAnimal,
  upload.fields([
    { name: 'image', maxCount: 10 },
    { name: 'video', maxCount: 5 },
    { name: 'previousOwnerAgreement', maxCount: 1 },
    { name: 'previousOwnerIdPhoto', maxCount: 1 },
    { name: 'vaccinationProofs', maxCount: 10 }
  ]),
  animalRegistering
);

router.get("/animals", getAnimals);
router.get("/animals/:id", getSingleAnimal);

router.put(
  "/animals/:id",
  verifyToken,
  protectRolePostAnimal,
  upload.fields([
    { name: 'image', maxCount: 10 },
    { name: 'video', maxCount: 5 },
    { name: 'previousOwnerAgreement', maxCount: 1 },
    { name: 'previousOwnerIdPhoto', maxCount: 1 },
    { name: 'vaccinationProofs', maxCount: 10 }
  ]),
  updateAnimalController
);

router.delete(
  "/animals/:id",
  verifyToken,
  protectRolePostAnimal,
  deleteAnimalController
);

router.delete(
  "/animals/:id/media",
  verifyToken,
  protectRolePostAnimal,
  deleteAnimalMediaController
);

router.get(
  "/admin/animals",
  verifyToken,
  isAdmin,
  getAnimals
);

export default router;