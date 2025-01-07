import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
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
  const vehicle = await this.model('Vehicle').findById(this.vehicle);
  const reviews = await this.model('Review').find({ vehicle: this.vehicle });
  
  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
  vehicle.rating = Math.round(averageRating * 10) / 10;
  await vehicle.save();
});

export default mongoose.model('Review', reviewSchema);