import Vehicle from '../models/Vehicle.js';

export const createVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.create({
      ...req.body,
      owner: req.user._id,
    });
    res.status(201).json(vehicle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getVehicles = async (req, res) => {
  try {
    const { type, priceRange, features, search, location } = req.query;
    const query = {};

    if (type) query.type = type;
    if (priceRange) query.priceRange = priceRange;
    if (features) query.features = { $in: features.split(',') };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { 'address.city': { $regex: search, $options: 'i' } },
        { cuisine: { $regex: search, $options: 'i' } },
      ];
    }

    if (location) {
      const [lng, lat] = location.split(',').map(Number);
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat],
          },
          $maxDistance: 10000, // 10km
        },
      };
    }

    const vehicles = await Vehicle.find(query)
      .populate('owner', 'name')
      .populate('reviews')
      .sort('-rating');

    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id)
      .populate('owner', 'name')
      .populate({
        path: 'reviews',
        populate: { path: 'user', select: 'name' },
      });

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    if (vehicle.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedVehicle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    if (vehicle.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await vehicle.deleteOne();
    res.json({ message: 'Vehicle removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};