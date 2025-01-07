import User from '../models/User.js';
import Booking from '../models/Booking.js';
import Review from '../models/Review.js';
import Vehicle from '../models/Vehicle.js';
import { catchAsync } from '../utils/catchAsync.js';

export const getUserProfile = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id)
    .select('-password')
    .populate('favorites', 'name type rating images');

  res.json(user);
});


export const updateUserProfile = catchAsync(async (req, res) => {
  const { name, email } = req.body;

  const user = await User.findById(req.user._id);
  
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  user.name = name || user.name;
  user.email = email || user.email;

  const updatedUser = await user.save();
  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role,
  });
});

export const getUserBookings = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const status = req.query.status;

  const query = { user: req.user._id };
  if (status) query.status = status;

  const bookings = await Booking.find(query)
    .populate('vehicle', 'name address images rating')
    .sort('-date')
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await Booking.countDocuments(query);

  res.json({
    bookings,
    page,
    pages: Math.ceil(total / limit),
    total,
    message: 'Bookings fetched successfully'
  });
});
export const getUserVehicles = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const vehicles = await Vehicle.find({ owner: req.user._id })
    .sort('-createdAt')
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await Vehicle.countDocuments({ owner: req.user._id });

  res.json({
    vehicles,
    page,
    pages: Math.ceil(total / limit),
    total,
  });
});

export const getUserReviews = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const reviews = await Review.find({ user: req.user._id })
    .populate('vehicle', 'name address images')
    .sort('-createdAt')
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await Review.countDocuments({ user: req.user._id });

  res.json({
    reviews,
    page,
    pages: Math.ceil(total / limit),
    total,
  });
});

export const getUserFavorites = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate({
      path: 'favorites',
      select: 'name type rating images address priceRange',
      populate: {
        path: 'reviews',
        select: 'rating',
      },
    });

  res.json(user.favorites);
});

export const toggleFavoriteVehicle = catchAsync(async (req, res) => {
  const { vehicleId } = req.params;
  const user = await User.findById(req.user._id);

  const isCurrentlyFavorited = user.favorites.includes(vehicleId);

  if (isCurrentlyFavorited) {
    user.favorites = user.favorites.filter(
      (id) => id.toString() !== vehicleId
    );
  } else {
    user.favorites.push(vehicleId);
  }

  await user.save();

  res.json({
    isFavorited: !isCurrentlyFavorited,
    message: isCurrentlyFavorited
      ? 'Vehicle removed from favorites'
      : 'Vehicle added to favorites',
  });
});