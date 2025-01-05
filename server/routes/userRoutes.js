import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getUserProfile,
  updateUserProfile,
  getUserReservations,
  getUserReviews,
  getUserFavorites,
  toggleFavoriteRestaurant,
} from '../controllers/userController.js';

const router = express.Router();

router.use(protect);

// Profile routes
router.route('/profile')
  .get(getUserProfile)
  .put(updateUserProfile);

// User activity routes
router.get('/reservations', getUserReservations);
router.get('/reviews', getUserReviews);

// Favorites management
router.get('/favorites', getUserFavorites);
router.post('/favorites/:restaurantId', toggleFavoriteRestaurant);

export default router;