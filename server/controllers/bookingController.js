import Booking from '../models/Booking.js';
import Vehicle from '../models/Vehicle.js';

export const createBooking = async (req, res) => {
  try {
    const { vehicleId, date, time, partySize, specialRequests } = req.body;

    // Check if vehicle exists
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    // Create booking
    const booking = await Booking.create({
      vehicle: vehicleId,
      user: req.user._id,
      date,
      time,
      partySize,
      specialRequests,
      status: 'pending',
    });

    // Populate vehicle details for the response
    const populatedBooking = await Booking.findById(booking._id)
      .populate('vehicle', 'name address');

    // Emit socket event for real-time updates
    req.app.get('io').emit('new_booking', populatedBooking);

    res.status(201).json(populatedBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const booking = await Booking.findById(id)
      .populate('booking', 'name address owner')
      .populate('user', 'name email');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if the user is the vehicle owner
    if (booking.vehicle.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    booking.status = status;
    await booking.save();

    // Emit socket event for real-time updates
    req.app.get('io').emit('booking_status', booking);

    // If status is confirmed, send email notification to user
    if (status === 'confirmed') {
      // You can implement email notification here
      console.log(`Sending confirmation email to ${booking.user.email}`);
    }

    res.json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('vehicle', 'name address')
      .sort('-date');

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getVehicleBookings = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.vehicleId);
    
    if (!vehicle || vehicle.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const bookings = await Booking.find({ vehicle: req.params.vehicletId })
      .populate('user', 'name email')
      .sort('-date');

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};   