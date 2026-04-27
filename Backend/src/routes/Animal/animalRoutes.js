import express from "express";
import animalRegiter from "../../controllers/animals/animalController.js"
import { animalIsVerified } from "../../validoators/Animal/animalvalidator.js";
import { protectRolePostAnimal } from "../../Middlewares/user/protect Role.js";
const router =  express();
router.post("/animal/register", protectRolePostAnimal, animalIsVerified, animalRegiter);

export default router;