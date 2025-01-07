import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { uploadMiddleware } from '../config/cloudinary.js';
import {
  createReview,
  getVehicleReviews,
  updateReview,
  deleteReview,
  addOwnerResponse,
  updateOwnerResponse,
} from '../controllers/reviewController.js';

const router = express.Router();

router.route('/')
  .post(protect, uploadMiddleware.array('photos', 5), createReview);

router.route('/vehicle/:vehicleId')
  .get(getVehicleReviews);

router.route('/:id')
  .put(protect, uploadMiddleware.array('photos', 5), updateReview)
  .delete(protect, deleteReview);

router.route('/:id/response')
  .post(protect, authorize('vehicle_owner'), addOwnerResponse)
  .put(protect, authorize('vehicle_owner'), updateOwnerResponse);

export default router;