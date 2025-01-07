import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  createVehicle,
  getVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
} from '../controllers/vehicleController.js';

const router = express.Router();

router.route('/')
  .get(getVehicles)
  .post(protect, authorize('vehicle_owner', 'admin'), createVehicle);

router.route('/:id')
  .get(getVehicleById)
  .put(protect, authorize('vehicle_owner', 'admin'), updateVehicle)
  .delete(protect, authorize('vehicle_owner', 'admin'), deleteVehicle);

export default router;