import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  getDashboardStats,
  getAllUsers,
  getAllRestaurants,
  getRestaurantAnalytics,
  getReservationStats,
  getReviewStats,
} from '../controllers/adminController.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

// Dashboard and analytics
router.get('/dashboard', getDashboardStats);
router.get('/analytics/restaurants', getRestaurantAnalytics);
router.get('/analytics/reservations', getReservationStats);
router.get('/analytics/reviews', getReviewStats);

// User management
router.get('/users', getAllUsers);

// Restaurant management
router.get('/restaurants', getAllRestaurants);

export default router;