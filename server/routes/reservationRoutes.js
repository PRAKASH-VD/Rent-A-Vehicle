import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  createReservation,
  getUserReservations,
  getRestaurantReservations,
  updateReservationStatus,
} from '../controllers/reservationController.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .post(createReservation)
  .get(getUserReservations);

router.route('/restaurant/:restaurantId')
  .get(authorize('restaurant_owner', 'admin'), getRestaurantReservations);

router.route('/:id/status')
  .patch(authorize('restaurant_owner', 'admin'), updateReservationStatus);

export default router;