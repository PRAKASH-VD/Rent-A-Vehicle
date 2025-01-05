import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  createRestaurant,
  getRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
} from '../controllers/restaurantController.js';

const router = express.Router();

router.route('/')
  .get(getRestaurants)
  .post(protect, authorize('restaurant_owner', 'admin'), createRestaurant);

router.route('/:id')
  .get(getRestaurantById)
  .put(protect, authorize('restaurant_owner', 'admin'), updateRestaurant)
  .delete(protect, authorize('restaurant_owner', 'admin'), deleteRestaurant);

export default router;