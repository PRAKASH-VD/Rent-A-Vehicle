import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  cuisine: {
    type: String,
    required: true,
  },
  priceRange: {
    
      type: Number,
      required: true
      
  },
  
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number],
  },
  images: [String],
  rating: {
    type: Number,
    default: 0,
  },
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review',
  }],
  menu: [{
    name: String,
    description: String,
    price: Number,
    category: String,
    image: String,
  }],
  openingHours: [{
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    },
    open: String,
    close: String,
  }],
  features: [{
    type: String,
    enum: ['Outdoor Seating', 'Live Music', 'Parking', 'Wheelchair Accessible', 'Wi-Fi'],
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true, 
  },
}, {
  timestamps: true,
});

restaurantSchema.index({ location: '2dsphere' });

export default mongoose.model('Restaurant', restaurantSchema);