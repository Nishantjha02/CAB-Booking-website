const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const data = req.body;
    console.log('Registration data:', data);
    
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User(data);
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.status(201).json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        vehicleType: user.vehicleType,
        location: user.location,
        isAvailable: user.isAvailable
      } 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email not found' });
    }
    
    if (!(await user.comparePassword(password))) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email, 
        role: user.role,
        vehicleType: user.vehicleType,
        location: user.location,
        isAvailable: user.isAvailable
      } 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get current user
router.get('/me', auth, (req, res) => {
  res.json({ 
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      vehicleType: req.user.vehicleType,
      location: req.user.location,
      isAvailable: req.user.isAvailable
    }
  });
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