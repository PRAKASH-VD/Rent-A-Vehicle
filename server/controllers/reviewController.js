import Review from '../models/Review.js';
import Vehicle from '../models/Vehicle.js';
import { uploadMiddleware, deleteImage } from '../config/cloudinary.js';

export const getVehicleReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ vehicle: req.params.vehicleId })
      .populate('user', 'name')
      .sort('-createdAt');

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const createReview = async (req, res) => {
  try {
    const { vehicleId, rating, comment } = req.body;
    const images = req.files ? req.files.map(file => file.path) : [];

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    const existingReview = await Review.findOne({
      vehicle: vehicleId,
      user: req.user._id,
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this vehicle' });
    }

    const review = await Review.create({
      vehicle: vehicleId,
      user: req.user._id,
      rating,
      comment,
      photos: images,
    });

    vehicle.reviews.push(review._id);
    await vehicle.save();

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

    await Vehicle.findByIdAndUpdate(review.vehicle, {
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
      .populate('vehicle', 'owner');

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if the user is the vehicle owner
    if (review.vehicle.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized - only vehicle owners can respond to reviews' });
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
      .populate('vehicle', 'owner');

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if the user is the restaurant owner
    if (review.vehicle.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized - only vehicle owners can update responses' });
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