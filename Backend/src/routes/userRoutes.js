import express from 'express';
import * as userController from '../controllers/users/userController.js';
import { verifyToken } from '../Middlewares/Auth/authMiddleware.js';
import { isAdmin } from '../Middlewares/Admin/amindMiddleware.js';
import upload from '../Middlewares/user/uplaodMiddleware.js';
const router = express.Router();

router.post(
  '/register',
  upload.fields([
    { name: 'profile_img', maxCount: 1 },
    { name: 'id_proof_img', maxCount: 1 },
    { name: 'shopLogo', maxCount: 1 }
  ]),
  userController.registerUser
);
router.post('/login', userController.loginUser);
router.get('/', verifyToken, isAdmin, userController.getAllUsers);
router.delete('/:id', verifyToken, isAdmin, userController.deleteUser);
router.put('/:id/role', verifyToken, isAdmin, userController.updateUserRole);

export default router;
