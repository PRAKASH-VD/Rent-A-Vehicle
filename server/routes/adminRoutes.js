import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  getDashboardStats,
  getAllUsers,
  getAllVehicles,
  getVehicleAnalytics,
  getBookingStats,
  getReviewStats,
} from '../controllers/adminController.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

// Dashboard and analytics
router.get('/dashboard', getDashboardStats);
router.get('/analytics/vehicles', getVehicleAnalytics);
router.get('/analytics/bookings', getBookingStats);
router.get('/analytics/reviews', getReviewStats);

// User management
router.get('/users', getAllUsers);

// Restaurant management
router.get('/vehicles', getAllVehicles);

export default router;