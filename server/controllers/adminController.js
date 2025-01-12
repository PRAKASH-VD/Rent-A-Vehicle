import User from '../models/User.js';
import Vechele from '../models/Vehicle.js';
import Booking from '../models/Booking.js';
import Review from '../models/Review.js';
import { catchAsync } from '../utils/catchAsync.js';


// Get dashboard statistics
export const getDashboardStats = catchAsync(async (req, res) => {
  const [
    totalUsers,
    totalVehicles,
    totalBookings,
    totalReviews,
  ] = await Promise.all([
    User.countDocuments(),
    Vehicle.countDocuments(),
    Booking.countDocuments(),
    Review.countDocuments(),
  ]);

  

  // Get recent activity
  const recentBookings = await Booking.find()
    .populate('vehicle', 'name')
    .populate('user', 'name')
    .sort('-createdAt')
    .limit(5);

 const recentReviews = await Review.find()
    .populate('vehicle', 'name')
    .populate('user', 'name')
    .sort('-createdAt')
    .limit(5);

  res.json({
    stats: {
      totalUsers,
      totalVehicles,
      totalBookings,
      totalReviews,
    },
    recentActivity: {
      bookings: recentBookings,
      reviews: recentReviews,
    },
  });
});

// Create a new vehicle
export const createVehicle = catchAsync(async (req, res, next) => {
  const { name, type, description, pricePerDay, status, owner } = req.body;

  // Validate required fields
  if (!name || !type || !description || !pricePerDay || !status || !owner) {
    return next(new AppError('All fields are required', 400));
  }

  // Create the vehicle in the database
  const vehicle = await Vehicle.create({
    name,
    type,
    description,
    pricePerDay,
    status,
    owner,
  });

  res.status(201).json({
    status: 'success',
    message: 'Vehicle created successfully!',
    data: {
      vehicle,
    },
  });
});

// Get all users with pagination and search
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

// Get all vehicles with pagination, search, and status filter
export const getAllVehicles = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || '';
  const status = req.query.status;

  const query = {
    ...(search && {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { type: { $regex: search, $options: 'i' } },
      ],
    }),
    ...(status && { status }),
  };

  const vehicles = await Vehicle.find(query)
  .populate('owner', 'name email')
  .sort('-createdAt')
  .skip((page - 1) * limit)
  .limit(limit);

const total = await Vehicle.countDocuments(query);

res.json({
  vehicles,
  page,
  pages: Math.ceil(total / limit),
  total,
});
});

// Get vehicle analytics (e.g., bookings, reviews, type distribution)
export const getVehicleAnalytics = catchAsync(async (req, res) => {
  const { startDate, endDate } = req.query;

  const dateQuery = {
    createdAt: {
      $gte: startDate ? new Date(startDate) : new Date(new Date().setMonth(new Date().getMonth() - 1)),
      $lte: endDate ? new Date(endDate) : new Date(),
    },
  };

  const [
    bookingsCount,
    reviewsCount,
    averageRating,
    typeDistribution,
  ] = await Promise.all([
    Booking.countDocuments(dateQuery),
    Review.countDocuments(dateQuery),
    Review.aggregate([
      { $match: dateQuery },
      { $group: { _id: null, avgRating: { $avg: '$rating' } } },
    ]),
    Vehicle.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
  ]);

  res.json({
    metrics: {
      bookingsCount,
      reviewsCount,
      averageRating: averageRating[0]?.avgRating || 0,
    },
    distributions: {
      type: typeDistribution,
    },
  });
});


// Get booking statistics by status and daily trends
export const getBookingStats = catchAsync(async (req, res) => {
  const { startDate, endDate } = req.query;

  const dateQuery = {
    date: {
      $gte: startDate ? new Date(startDate) : new Date(new Date().setMonth(new Date().getMonth() - 1)),
      $lte: endDate ? new Date(endDate) : new Date(),
    },
  };

  const bookingStats = await Booking.aggregate([
    { $match: dateQuery },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  const dailyBookings = await Booking.aggregate([
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
    byStatus: bookingStats,
    dailyTrends: dailyBookings,
  });
});

// Get review statistics (rating distribution and daily trends)
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