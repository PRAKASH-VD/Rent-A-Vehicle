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

// Protect all routes and restrict to admin role
router.use(protect);
router.use(authorize('admin'));

// **Dashboard and Analytics**
// Get dashboard statistics
router.get('/dashboard', getDashboardStats);

// Get vehicle analytics
router.get('/analytics/vehicles', getVehicleAnalytics);

// Get booking analytics
router.get('/analytics/bookings', getBookingStats);

// Get review analytics
router.get('/analytics/reviews', getReviewStats);

// **User Management**
// Get all users
router.get('/users', getAllUsers);

// Delete a user by ID
// router.delete('/users/:id', deleteUserById);

// **Vehicle Management**
// Get all vehicles
router.get('/vehicles', getAllVehicles);

// Delete a vehicle by ID
// router.delete('/vehicles/:id', deleteVehicleById);

// Update vehicle details
// router.put('/vehicles/:id', updateVehicleDetails);

// Create a new vehicle
// router.post('/vehicles', createVehicle);

export default router;