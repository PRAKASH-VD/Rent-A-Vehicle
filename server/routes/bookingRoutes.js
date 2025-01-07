import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  createBooking,
  getUserBookings,
  getVehicleBookings,
  updateBookingStatus,
} from '../controllers/bookingController.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .post(createBooking)
  .get(getUserBookings);

router.route('/vehicle/:vehicleId')
  .get(authorize('vehicle_owner', 'admin'), getVehicleBookings);

router.route('/:id/status')
  .patch(authorize('vehicle_owner', 'admin'), updateBookingStatus);

export default router;