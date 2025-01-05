import User from '../models/User.js';
import Restaurant from '../models/Restaurant.js';
import Reservation from '../models/Reservation.js';
import Review from '../models/Review.js';
import { catchAsync } from '../utils/catchAsync.js';

export const getDashboardStats = catchAsync(async (req, res) => {
  const [
    totalUsers,
    totalRestaurants,
    totalReservations,
    totalReviews,
  ] = await Promise.all([
    User.countDocuments(),
    Restaurant.countDocuments(),
    Reservation.countDocuments(),
    Review.countDocuments(),
  ]);

  // Get recent activity
  const recentReservations = await Reservation.find()
    .populate('restaurant', 'name')
    .populate('user', 'name')
    .sort('-createdAt')
    .limit(5);

  const recentReviews = await Review.find()
    .populate('restaurant', 'name')
    .populate('user', 'name')
    .sort('-createdAt')
    .limit(5);

  res.json({
    stats: {
      totalUsers,
      totalRestaurants,
      totalReservations,
      totalReviews,
    },
    recentActivity: {
      reservations: recentReservations,
      reviews: recentReviews,
    },
  });
});

export const getAllUsers = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || '';

  const query = search
    ? {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ],
      }
    : {};

  const users = await User.find(query)
    .select('-password')
    .sort('-createdAt')
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await User.countDocuments(query);

  res.json({
    users,
    page,
    pages: Math.ceil(total / limit),
    total,
  });
});

export const getAllRestaurants = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || '';
  const status = req.query.status;

  const query = {
    ...(search && {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { cuisine: { $regex: search, $options: 'i' } },
      ],
    }),
    ...(status && { status }),
  };

  const restaurants = await Restaurant.find(query)
    .populate('owner', 'name email')
    .sort('-createdAt')
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await Restaurant.countDocuments(query);

  res.json({
    restaurants,
    page,
    pages: Math.ceil(total / limit),
    total,
  });
});

export const getRestaurantAnalytics = catchAsync(async (req, res) => {
  const { startDate, endDate } = req.query;

  const dateQuery = {
    createdAt: {
      $gte: startDate ? new Date(startDate) : new Date(new Date().setMonth(new Date().getMonth() - 1)),
      $lte: endDate ? new Date(endDate) : new Date(),
    },
  };

  const [
    reservationsCount,
    reviewsCount,
    averageRating,
    cuisineDistribution,
  ] = await Promise.all([
    Reservation.countDocuments(dateQuery),
    Review.countDocuments(dateQuery),
    Review.aggregate([
      { $match: dateQuery },
      { $group: { _id: null, avgRating: { $avg: '$rating' } } },
    ]),
    Restaurant.aggregate([
      { $group: { _id: '$cuisine', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
  ]);

  res.json({
    metrics: {
      reservationsCount,
      reviewsCount,
      averageRating: averageRating[0]?.avgRating || 0,
    },
    distributions: {
      cuisine: cuisineDistribution,
    },
  });
});

export const getReservationStats = catchAsync(async (req, res) => {
  const { startDate, endDate } = req.query;

  const dateQuery = {
    date: {
      $gte: startDate ? new Date(startDate) : new Date(new Date().setMonth(new Date().getMonth() - 1)),
      $lte: endDate ? new Date(endDate) : new Date(),
    },
  };

  const reservationStats = await Reservation.aggregate([
    { $match: dateQuery },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  const dailyReservations = await Reservation.aggregate([
    { $match: dateQuery },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id': 1 } },
  ]);

  res.json({
    byStatus: reservationStats,
    dailyTrends: dailyReservations,
  });
});

export const getReviewStats = catchAsync(async (req, res) => {
  const { startDate, endDate } = req.query;

  const dateQuery = {
    createdAt: {
      $gte: startDate ? new Date(startDate) : new Date(new Date().setMonth(new Date().getMonth() - 1)),
      $lte: endDate ? new Date(endDate) : new Date(),
    },
  };

  const [ratingDistribution, dailyReviews] = await Promise.all([
    Review.aggregate([
      { $match: dateQuery },
      { $group: { _id: '$rating', count: { $sum: 1 } } },
      { $sort: { '_id': 1 } },
    ]),
    Review.aggregate([
      { $match: dateQuery },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
          averageRating: { $avg: '$rating' },
        },
      },
      { $sort: { '_id': 1 } },
    ]),
  ]);

  res.json({
    ratingDistribution,
    dailyTrends: dailyReviews,
  });
});