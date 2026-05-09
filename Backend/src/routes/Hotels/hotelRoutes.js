// routes/Hotels/hotelRoutes.js
import express from 'express';
import * as hotelController from '../../controllers/Hotels/hotelController.js';
import * as hotelAgreementController from '../../controllers/Hotels/hotelAgreementController.js';
import { verifyToken } from '../../Middlewares/Auth/authMiddleware.js';
import { isAdmin } from '../../Middlewares/Admin/amindMiddleware.js'; // Fixed typo
import upload from '../../Middlewares/user/uplaodMiddleware.js'; // Fixed typo

const router = express.Router();


// Hotel Registration & Authentication
router.post('/register', hotelController.registerHotel);
router.post('/login', hotelController.hotelLogin);

// Password Reset Routes
router.post('/forgot-password', hotelController.hotelForgotPassword);
router.post('/verify-otp', hotelController.hotelVerifyResetOTP);
router.post('/reset-password', hotelController.hotelConfirmResetPassword);

// Search Hotels (Public)
router.get('/search', hotelController.searchHotels);

// ====================== PROTECTED ROUTES (Require Authentication) ======================

// Hotel Profile
router.get('/:hotelId/profile', verifyToken, hotelController.getHotelProfile);
router.put('/:hotelId/profile', verifyToken, hotelController.updateHotelProfile);

// Child Hotels Management
router.get('/:hotelId/child-hotels', verifyToken, hotelController.getChildHotels);

// Authorize Hotel for Child Registration (Admin Only)
router.post(
  '/:hotelId/authorize-registration',
  verifyToken,
  isAdmin,
  hotelController.authorizeHotelRegistration
);


router.get(
  '/all',
  verifyToken,
  isAdmin,
  hotelController.getAllHotels
);

router.put(
  '/:hotelId/approve',
  verifyToken,
  isAdmin,
  hotelController.approveHotel
);

// ====================== STATISTICS ======================

router.get(
  '/:hotelId/statistics',
  verifyToken,
  hotelController.getHotelStatistics
);


router.post(
  '/:hotelId/book-animal',
  verifyToken,
  hotelController.bookAnimalForHotel
);

router.get(
  '/:hotelId/bookings',
  verifyToken,
  hotelController.getHotelBookings
);

router.put(
  '/bookings/:bookingId/status',
  verifyToken,
  hotelController.updateBookingStatus
);

// ====================== RATING ROUTES ======================

router.post(
  '/:hotelId/rate',
  verifyToken,
  hotelController.rateHotel
);

// ====================== HOTEL AGREEMENT ROUTES ======================

router.post(
  '/agreements/create',
  verifyToken,
  hotelAgreementController.createHotelAgreement
);

router.get(
  '/agreements/:agreementId',
  verifyToken,
  hotelAgreementController.getHotelAgreement
);

router.get(
  '/:hotelId/agreements',
  verifyToken,
  hotelAgreementController.getHotelAgreements
);

router.put(
  '/agreements/:agreementId',
  verifyToken,
  hotelAgreementController.updateHotelAgreement
);

// Agreement Workflow
router.post(
  '/agreements/:agreementId/send/:recipientHotelId',
  verifyToken,
  hotelAgreementController.sendAgreementForApproval
);

router.post(
  '/agreements/:agreementId/accept',
  verifyToken,
  hotelAgreementController.acceptAgreement
);

router.post(
  '/agreements/:agreementId/reject',
  verifyToken,
  hotelAgreementController.rejectAgreement
);

router.post(
  '/agreements/:agreementId/terminate',
  verifyToken,
  hotelAgreementController.terminateAgreement
);


router.post(
  '/:hotelId/seller-agreements/create',
  verifyToken,
  hotelController.createHotelSellerAgreement
);

router.get(
  '/:hotelId/seller-agreements',
  verifyToken,
  hotelController.getHotelSellerAgreements
);

router.post(
  '/seller-agreements/:agreementId/send',
  verifyToken,
  hotelController.sendAgreementToSeller
);

// ====================== MEETING ROUTES ======================

router.post(
  '/:hotelId/meetings/create',
  verifyToken,
  hotelController.createHotelMeeting
);

export default router;