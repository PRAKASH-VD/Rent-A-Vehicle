import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { uploadMiddleware } from '../config/cloudinary.js';
import {
  createReview,
  getRestaurantReviews,
  updateReview,
  deleteReview,
  addOwnerResponse,
  updateOwnerResponse,
} from '../controllers/reviewController.js';

const router = express.Router();

router.route('/')
  .post(protect, uploadMiddleware.array('photos', 5), createReview);

router.route('/restaurant/:restaurantId')
  .get(getRestaurantReviews);

router.route('/:id')
  .put(protect, uploadMiddleware.array('photos', 5), updateReview)
  .delete(protect, deleteReview);

router.route('/:id/response')
  .post(protect, authorize('restaurant_owner'), addOwnerResponse)
  .put(protect, authorize('restaurant_owner'), updateOwnerResponse);

export default router;