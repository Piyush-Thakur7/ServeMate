const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Donation = require('../models/Donation');

const router = express.Router();

// Middleware to verify token
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = await User.findById(decoded.userId);
    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Make a donation
router.post('/', auth, async (req, res) => {
  try {
    const { cause, amount } = req.body;
    
    if (!cause || !amount || amount < 1) {
      return res.status(400).json({ message: 'Invalid donation data' });
    }

    // Simulate NGO assignment based on cause
    const ngos = {
      meals: 'Sewa Foundation',
      trees: 'GreenIndia NGO',
      essentials: 'CareCrew India'
    };

    const locations = {
      meals: 'Lucknow, UP',
      trees: 'Dehradun, UK',
      essentials: 'Kanpur, UP'
    };

    const donation = new Donation({
      user: req.user._id,
      cause,
      amount,
      ngo: ngos[cause] || 'Unknown NGO',
      location: locations[cause] || 'Unknown Location'
    });

    await donation.save();

    // Update user stats
    req.user.totalDonated += amount;
    req.user.donationsCount += 1;
    req.user.xp += 10; // XP for donation

    // Level up logic (simple)
    if (req.user.xp >= 200 && req.user.level < 2) req.user.level = 2;
    if (req.user.xp >= 600 && req.user.level < 3) req.user.level = 3;
    if (req.user.xp >= 1200 && req.user.level < 4) req.user.level = 4;
    if (req.user.xp >= 2500 && req.user.level < 5) req.user.level = 5;

    await req.user.save();

    res.status(201).json({
      message: 'Donation successful',
      donation,
      user: {
        totalDonated: req.user.totalDonated,
        donationsCount: req.user.donationsCount,
        xp: req.user.xp,
        level: req.user.level
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's donations
router.get('/', auth, async (req, res) => {
  try {
    const donations = await Donation.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('user', 'name');
    
    res.json({ donations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all donations (for transparency page)
router.get('/all', async (req, res) => {
  try {
    const donations = await Donation.find({ status: 'verified' })
      .sort({ createdAt: -1 })
      .populate('user', 'name city')
      .limit(50);
    
    res.json({ donations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;