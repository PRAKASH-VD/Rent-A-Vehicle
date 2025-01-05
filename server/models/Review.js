import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
  },
  photos: [String],
  ownerResponse: {
    text: String,
    date: Date,
  },
}, {
  timestamps: true,
});

reviewSchema.post('save', async function() {
  const restaurant = await this.model('Restaurant').findById(this.restaurant);
  const reviews = await this.model('Review').find({ restaurant: this.restaurant });
  
  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
  restaurant.rating = Math.round(averageRating * 10) / 10;
  await restaurant.save();
});

export default mongoose.model('Review', reviewSchema);