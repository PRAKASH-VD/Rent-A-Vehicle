import Reservation from '../models/Reservation.js';
import Review from '../models/Review.js';
import User from '../models/User.js';
import { catchAsync } from '../utils/catchAsync.js';
import mongoose from 'mongoose';

export const getAdminStats = catchAsync(async (req, res) => {
  const { restaurantId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
    return res.status(400).json({ message: "Invalid restaurant ID" });
  }

  // Today's Date Range
  const startOfDay = new Date().setHours(0, 0, 0, 0);
  const endOfDay = new Date().setHours(23, 59, 59, 999);

  // Fetch reservation counts by status
  const reservationCounts = await Reservation.aggregate([
    { $match: { restaurant: mongoose.Types.ObjectId(restaurantId) } },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  // Map reservation counts to a readable format
  const reservationStatusCounts = reservationCounts.reduce(
    (acc, curr) => ({ ...acc, [curr._id]: curr.count }),
    { confirmed: 0, pending: 0, canceled: 0, upcoming: 0, past: 0 }
  );

  // Fetch users who visited the restaurant
  const userVisits = await Reservation.aggregate([
    { $match: { restaurant: mongoose.Types.ObjectId(restaurantId), status: 'confirmed' } },
    { $group: { _id: '$user', count: { $sum: 1 } } },
    { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'userDetails' } },
    { $unwind: '$userDetails' },
    { $project: { _id: 0, user: '$userDetails.name', email: '$userDetails.email', visitCount: '$count' } },
  ]);

  // Fetch total reviews and review details
  const reviewCounts = await Review.countDocuments({ restaurant: restaurantId });
  const reviews = await Review.find({ restaurant: restaurantId })
    .populate('user', 'name')
    .sort('-createdAt');

  // Fetch today's reservations
  const todaysReservations = await Reservation.find({
    restaurant: restaurantId,
    date: { $gte: startOfDay, $lte: endOfDay },
  })
    .populate('user', 'name email')
    .sort('-createdAt');

  res.json({
    stats: {
      reservations: reservationStatusCounts,
      totalUsersVisited: userVisits.length,
      totalReviews: reviewCounts,
      todaysReservationsCount: todaysReservations.length,
    },
    data: {
      userVisits,
      reviews,
      todaysReservations,
    },
  });
});
