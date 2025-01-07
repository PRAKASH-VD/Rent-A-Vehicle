import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getUserProfile,
  updateUserProfile,
  getUserVehicles,
  getUserReviews,
  getUserFavorites,
  toggleFavoriteVehicle,
  getUserBookings,
} from '../controllers/userController.js';

const router = express.Router();

router.use(protect);

// Profile routes
router.route('/profile')
  .get(getUserProfile)
  .put(updateUserProfile);

// User activity routes
router.get('/bookings', getUserBookings);
router.get('/reviews', getUserReviews);

// Vehicle management
router.get('/vehicles', getUserVehicles);

// Favorites management
router.get('/favorites', getUserFavorites);
router.post('/favorites/:vehicleId', toggleFavoriteVehicle);

export default router;