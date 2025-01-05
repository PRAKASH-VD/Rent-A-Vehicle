import Review from '../models/Review.js';
import Restaurant from '../models/Restaurant.js';
import { uploadMiddleware, deleteImage } from '../config/cloudinary.js';

export const getRestaurantReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ restaurant: req.params.restaurantId })
      .populate('user', 'name')
      .sort('-createdAt');

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const createReview = async (req, res) => {
  try {
    const { restaurantId, rating, comment } = req.body;
    const images = req.files ? req.files.map(file => file.path) : [];

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const existingReview = await Review.findOne({
      restaurant: restaurantId,
      user: req.user._id,
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this restaurant' });
    }

    const review = await Review.create({
      restaurant: restaurantId,
      user: req.user._id,
      rating,
      comment,
      photos: images,
    });

    restaurant.reviews.push(review._id);
    await restaurant.save();

    const populatedReview = await Review.findById(review._id)
      .populate('user', 'name');

    res.status(201).json(populatedReview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Handle image updates
    const newImages = req.files ? req.files.map(file => file.path) : [];
    const imagesToDelete = req.body.deletedImages || [];

    // Delete removed images from Cloudinary
    for (const imageUrl of imagesToDelete) {
      if (review.photos.includes(imageUrl)) {
        await deleteImage(imageUrl);
      }
    }

    const updatedPhotos = [
      ...review.photos.filter(photo => !imagesToDelete.includes(photo)),
      ...newImages,
    ];

    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      { ...req.body, photos: updatedPhotos },
      { new: true }
    ).populate('user', 'name');

    res.json(updatedReview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Delete images from Cloudinary
    for (const imageUrl of review.photos) {
      await deleteImage(imageUrl);
    }

    await Restaurant.findByIdAndUpdate(review.restaurant, {
      $pull: { reviews: review._id },
    });

    await review.deleteOne();
    res.json({ message: 'Review removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addOwnerResponse = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('restaurant', 'owner');

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if the user is the restaurant owner
    if (review.restaurant.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized - only restaurant owners can respond to reviews' });
    }

    // Check if response already exists
    if (review.ownerResponse) {
      return res.status(400).json({ message: 'Owner response already exists' });
    }

    review.ownerResponse = {
      text: req.body.response,
      date: new Date(),
    };

    await review.save();

    const populatedReview = await Review.findById(review._id)
      .populate('user', 'name')
      .populate('restaurant', 'name owner');

    // Emit socket event for real-time updates
    req.app.get('io').emit('review_response', populatedReview);

    res.json(populatedReview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateOwnerResponse = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('restaurant', 'owner');

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if the user is the restaurant owner
    if (review.restaurant.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized - only restaurant owners can update responses' });
    }

    // Check if response exists
    if (!review.ownerResponse) {
      return res.status(404).json({ message: 'No owner response exists' });
    }

    review.ownerResponse = {
      text: req.body.response,
      date: new Date(),
    };

    await review.save();

    const populatedReview = await Review.findById(review._id)
      .populate('user', 'name')
      .populate('restaurant', 'name owner');

    // Emit socket event for real-time updates
    req.app.get('io').emit('review_response_update', populatedReview);

    res.json(populatedReview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};