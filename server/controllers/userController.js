import User from '../models/User.js';
import Reservation from '../models/Reservation.js';
import Review from '../models/Review.js';
import Restaurant from '../models/Restaurant.js';
import { catchAsync } from '../utils/catchAsync.js';

export const getUserProfile = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id)
    .select('-password')
    .populate('favorites', 'name cuisine rating images');

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

export const getUserReservations = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const status = req.query.status;

  const query = { user: req.user._id };
  if (status) query.status = status;

  const reservations = await Reservation.find(query)
    .populate('restaurant', 'name address images rating')
    .sort('-date')
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await Reservation.countDocuments(query);

  res.json({
    reservations,
    page,
    pages: Math.ceil(total / limit),
    total,
  });
});

export const getUserReviews = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const reviews = await Review.find({ user: req.user._id })
    .populate('restaurant', 'name address images')
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
      select: 'name cuisine rating images address priceRange',
      populate: {
        path: 'reviews',
        select: 'rating',
      },
    });

  res.json(user.favorites);
});

export const toggleFavoriteRestaurant = catchAsync(async (req, res) => {
  const { restaurantId } = req.params;
  const user = await User.findById(req.user._id);

  const isCurrentlyFavorited = user.favorites.includes(restaurantId);

  if (isCurrentlyFavorited) {
    user.favorites = user.favorites.filter(
      (id) => id.toString() !== restaurantId
    );
  } else {
    user.favorites.push(restaurantId);
  }

  await user.save();

  res.json({
    isFavorited: !isCurrentlyFavorited,
    message: isCurrentlyFavorited
      ? 'Restaurant removed from favorites'
      : 'Restaurant added to favorites',
  });
});