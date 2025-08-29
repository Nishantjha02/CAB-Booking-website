const express = require('express');
const Booking = require('../models/Booking');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Create booking
router.post('/', auth, async (req, res) => {
  try {
    const { pickup, destination, fare } = req.body;
    
    const booking = new Booking({
      user: req.user._id,
      pickup,
      destination,
      fare
    });

    await booking.save();
    await booking.populate('user', 'name phone');
    
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user bookings
router.get('/user', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('driver', 'name phone')
      .sort({ createdAt: -1 });
    
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get available bookings for drivers (location-based)
router.get('/available', auth, async (req, res) => {
  try {
    if (req.user.role !== 'driver') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Remove availability check - drivers can see bookings even when busy

    const driverLocation = req.user.location;
    if (!driverLocation || !driverLocation.lat || !driverLocation.lng) {
      return res.status(400).json({ message: 'Driver location not set' });
    }

    // Find pending bookings
    const bookings = await Booking.find({ status: 'pending' })
      .populate('user', 'name phone')
      .sort({ createdAt: -1 });
    
    // Filter bookings within 10km radius
    const nearbyBookings = bookings.filter(booking => {
      const distance = calculateDistance(
        driverLocation.lat,
        driverLocation.lng,
        booking.pickup.lat,
        booking.pickup.lng
      );
      return distance <= 10; // 10km radius
    });
    
    res.json(nearbyBookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Helper function to calculate distance between two points
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Accept booking
router.patch('/:id/accept', auth, async (req, res) => {
  try {
    if (req.user.role !== 'driver') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Allow accepting bookings even if marked as unavailable

    const booking = await Booking.findById(req.params.id);
    if (!booking || booking.status !== 'pending') {
      return res.status(400).json({ message: 'Booking not available' });
    }

    // Check if driver is within reasonable distance
    const driverLocation = req.user.location;
    const distance = calculateDistance(
      driverLocation.lat,
      driverLocation.lng,
      booking.pickup.lat,
      booking.pickup.lng
    );

    if (distance > 10) {
      return res.status(400).json({ message: 'Booking too far from your location' });
    }

    booking.driver = req.user._id;
    booking.status = 'accepted';
    booking.acceptedAt = new Date();
    await booking.save();

    // Update driver availability
    req.user.isAvailable = false;
    await req.user.save();

    await booking.populate(['user', 'driver']);
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update booking status
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (req.user.role === 'driver' && booking.driver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    booking.status = status;
    if (status === 'completed') {
      booking.completedTime = new Date();
      // Make driver available again
      if (req.user.role === 'driver') {
        req.user.isAvailable = true;
        req.user.totalRides += 1;
        await req.user.save();
      }
    } else if (status === 'cancelled') {
      // Make driver available again if cancelled
      if (req.user.role === 'driver' && booking.driver) {
        const driver = await User.findById(booking.driver);
        if (driver) {
          driver.isAvailable = true;
          await driver.save();
        }
      }
    }
    
    await booking.save();
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get driver's active bookings
router.get('/driver', auth, async (req, res) => {
  try {
    if (req.user.role !== 'driver') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const bookings = await Booking.find({ 
      driver: req.user._id,
      status: { $in: ['accepted', 'in-progress'] }
    })
      .populate('user', 'name phone')
      .sort({ createdAt: -1 });
    
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update driver availability
router.patch('/availability', auth, async (req, res) => {
  try {
    if (req.user.role !== 'driver') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { isAvailable } = req.body;
    req.user.isAvailable = isAvailable;
    await req.user.save();
    
    res.json({ message: 'Availability updated', isAvailable });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;