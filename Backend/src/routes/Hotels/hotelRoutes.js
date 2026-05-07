import express from 'express';
import * as hotelController from '../../controllers/Hotels/hotelController.js';
import * as hotelAgreementController from '../../controllers/Hotels/hotelAgreementController.js';
import { verifyToken } from '../../Middlewares/Auth/authMiddleware.js';
import { isAdmin } from '../../Middlewares/Admin/amindMiddleware.js';
import upload from '../../Middlewares/user/uplaodMiddleware.js';

const router = express.Router();

// Hotel Registration & Authentication Routes
router.post('/register', hotelController.registerHotel);
router.post('/login', hotelController.hotelLogin);

// Hotel Profile Routes (require authentication)
router.get('/:hotelId/profile', hotelController.getHotelProfile);
router.put('/:hotelId/profile', hotelController.updateHotelProfile);

// Child Hotels Management
router.get('/:hotelId/child-hotels', hotelController.getChildHotels);

// Admin Routes - Authorize hotel registration
router.post(
  '/:hotelId/authorize-registration',
  verifyToken,
  isAdmin,
  hotelController.authorizeHotelRegistration
);

// Hotel Agreement Routes
router.post('/agreements/create', hotelAgreementController.createHotelAgreement);
router.get('/agreements/:agreementId', hotelAgreementController.getHotelAgreement);
router.get('/:hotelId/agreements', hotelAgreementController.getHotelAgreements);
router.put('/agreements/:agreementId', hotelAgreementController.updateHotelAgreement);

// Agreement Workflow Routes
router.post(
  '/agreements/:agreementId/send/:recipientHotelId',
  hotelAgreementController.sendAgreementForApproval
);
router.post('/agreements/:agreementId/accept', hotelAgreementController.acceptAgreement);
router.post('/agreements/:agreementId/reject', hotelAgreementController.rejectAgreement);
router.post('/agreements/:agreementId/terminate', hotelAgreementController.terminateAgreement);

// Animal Booking Routes
router.post('/:hotelId/book-animal', hotelController.bookAnimalForHotel);
router.get('/:hotelId/bookings', hotelController.getHotelBookings);
router.put('/bookings/:bookingId/status', hotelController.updateBookingStatus);

// Rating Routes
router.post('/:hotelId/rate', hotelController.rateHotel);

// Hotel-Seller Agreement Routes
router.post('/:hotelId/seller-agreements/create', hotelController.createHotelSellerAgreement);
router.get('/:hotelId/seller-agreements', hotelController.getHotelSellerAgreements);
router.post('/seller-agreements/:agreementId/send', hotelController.sendAgreementToSeller);

// Meeting Routes
router.post('/:hotelId/meetings/create', hotelController.createHotelMeeting);

export default router;
