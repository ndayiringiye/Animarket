import express from 'express';
import * as userController from '../controllers/users/userController.js';
import { verifyToken } from '../Middlewares/Auth/authMiddleware.js';
import { isAdmin } from '../Middlewares/Admin/amindMiddleware.js';
import upload from '../Middlewares/user/uplaodMiddleware.js';
import { getAllUsers, getUserById,  deleteUser, updateUserRole, verifyResetOTP } from '../controllers/users/userController.js';
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
router.post('/forgot-password', userController.forgotPassword);
router.post('/verify-reset-otp', userController.verifyResetOTP);
router.post('/confirm-reset-password', userController.confirmResetPassword);
router.post('/reset-password', userController.resetPassword);
router.get('/me', verifyToken, userController.getMe);
router.get('/', verifyToken, isAdmin, userController.getAllUsers);
router.delete('/:id', verifyToken, isAdmin, userController.deleteUser);
router.put('/:id/role', verifyToken, isAdmin, userController.updateUserRole);

// Public – poll farmer online status (no auth required so customer can call it)
router.get('/:id/online-status', async (req, res) => {
  try {
    const { default: User } = await import('../models/users/UserModel.js');
    const user = await User.findById(req.params.id).select('lastSeen name');
    if (!user) return res.status(404).json({ online: false });
    const ONLINE_THRESHOLD_MS = 5 * 60 * 1000; // 5 minutes
    const online = user.lastSeen && (Date.now() - new Date(user.lastSeen).getTime()) < ONLINE_THRESHOLD_MS;
    res.json({ online: Boolean(online), lastSeen: user.lastSeen, name: user.name });
  } catch (err) {
    res.status(500).json({ online: false, message: err.message });
  }
});


export default router;
