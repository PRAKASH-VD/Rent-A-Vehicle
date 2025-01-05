import Reservation from '../models/Reservation.js';
import Restaurant from '../models/Restaurant.js';

export const createReservation = async (req, res) => {
  try {
    const { restaurantId, date, time, partySize, specialRequests } = req.body;

    // Check if restaurant exists
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Create reservation
    const reservation = await Reservation.create({
      restaurant: restaurantId,
      user: req.user._id,
      date,
      time,
      partySize,
      specialRequests,
      status: 'pending',
    });

    // Populate restaurant details for the response
    const populatedReservation = await Reservation.findById(reservation._id)
      .populate('restaurant', 'name address');

    // Emit socket event for real-time updates
    req.app.get('io').emit('new_reservation', populatedReservation);

    res.status(201).json(populatedReservation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateReservationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const reservation = await Reservation.findById(id)
      .populate('restaurant', 'name address owner')
      .populate('user', 'name email');

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    // Check if the user is the restaurant owner
    if (reservation.restaurant.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    reservation.status = status;
    await reservation.save();

    // Emit socket event for real-time updates
    req.app.get('io').emit('reservation_status', reservation);

    // If status is confirmed, send email notification to user
    if (status === 'confirmed') {
      // You can implement email notification here
      console.log(`Sending confirmation email to ${reservation.user.email}`);
    }

    res.json(reservation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getUserReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user._id })
      .populate('restaurant', 'name address')
      .sort('-date');

    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRestaurantReservations = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.restaurantId);
    
    if (!restaurant || restaurant.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const reservations = await Reservation.find({ restaurant: req.params.restaurantId })
      .populate('user', 'name email')
      .sort('-date');

    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};   