import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  role: {
    type: String,
    enum: ['user', 'vehicle_owner', 'admin'],
    default: 'user',
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
  }],
}, {
  timestamps: true,
});

userSchema.pre('save', async function(next) {
  // Only hash the password if it's been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Add a method to validate password updates
userSchema.pre('save', function(next) {
  // If the password is not modified or this is a password reset
  if (!this.isModified('password') || this.resetPasswordToken) {
    // Skip validation for name field during password reset
    this.schema.path('name').required(false);
  }
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);