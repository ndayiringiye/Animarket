import express from "express";
import { getOwnershipDocsList, updateOwnershipDocStatusController } from "../../controllers/Ownership/ownershipController.js";
import { verifyToken } from "../../Middlewares/Auth/authMiddleware.js";
import { isAdmin } from "../../Middlewares/Admin/amindMiddleware.js";

const router = express.Router();

router.get("/admin/list", verifyToken, isAdmin, getOwnershipDocsList);
router.put("/admin/:id/status", verifyToken, isAdmin, updateOwnershipDocStatusController);

export default router;
