import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A vehicle must have a name'],
    },
    type: {
      type: String,
      required: [true, 'A vehicle must have a type'],
    },
    description: {
      type: String,
      required: [true, 'A vehicle must have a description'],
    },

  priceRange: {    
      type: Number,
      required: [true, 'A vehicle must have a price per day'],      
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
    enum: ['Open Type', 'With-Out Driver', 'with Driver', 'Wheelchair Accessible', 'Wi-Fi'],
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required:  [true, 'A vehicle must have an owner'], 
  },
}, {
  timestamps: true,
});

vehicleSchema.index({ location: '2dsphere' });

export default mongoose.model('Vehicle', vehicleSchema);