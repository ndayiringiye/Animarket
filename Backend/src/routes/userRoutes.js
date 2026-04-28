import express from 'express';
import * as userController from '../controllers/users/userController.js';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/', verifyToken, isAdmin, userController.getAllUsers);
router.delete('/:id', verifyToken, isAdmin, userController.deleteUser);
router.put('/:id/role', verifyToken, isAdmin, userController.updateUserRole);

export default router;
