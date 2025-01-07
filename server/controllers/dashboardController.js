import Booking from '../models/Booking.js';
import Review from '../models/Review.js';
import User from '../models/User.js';
import { catchAsync } from '../utils/catchAsync.js';
import mongoose from 'mongoose';

export const getAdminStats = catchAsync(async (req, res) => {
  const { vehicleId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(vehicleId)) {
    return res.status(400).json({ message: "Invalid restaurant ID" });
  }

  // Today's Date Range
  const startOfDay = new Date().setHours(0, 0, 0, 0);
  const endOfDay = new Date().setHours(23, 59, 59, 999);

  // Fetch booking counts by status
  const bookingCounts = await Booking.aggregate([
    { $match: { restaurant: mongoose.Types.ObjectId(vehicleId) } },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  // Map booking counts to a readable format
  const bookingStatusCounts = bookingCounts.reduce(
    (acc, curr) => ({ ...acc, [curr._id]: curr.count }),
    { confirmed: 0, pending: 0, canceled: 0, upcoming: 0, past: 0 }
  );

  // Fetch users who visited the vehicle
  const userVisits = await Booking.aggregate([
    { $match: { vehicle: mongoose.Types.ObjectId(vehicleId), status: 'confirmed' } },
    { $group: { _id: '$user', count: { $sum: 1 } } },
    { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'userDetails' } },
    { $unwind: '$userDetails' },
    { $project: { _id: 0, user: '$userDetails.name', email: '$userDetails.email', visitCount: '$count' } },
  ]);

  // Fetch total reviews and review details
  const reviewCounts = await Review.countDocuments({ vehicle: vehicleId });
  const reviews = await Review.find({ vehicle: vehicleId })
    .populate('user', 'name')
    .sort('-createdAt');

  // Fetch today's bookings
  const todaysBookings = await Booking.find({
    vehicle: vehicleId,
    date: { $gte: startOfDay, $lte: endOfDay },
  })
    .populate('user', 'name email')
    .sort('-createdAt');

  res.json({
    stats: {
      bookings: bookingStatusCounts,
      totalUsersVisited: userVisits.length,
      totalReviews: reviewCounts,
      todaysBookingCount: todaysBookings.length,
    },
    data: {
      userVisits,
      reviews,
      todaysBookings,
    },
  });
});
