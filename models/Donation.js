const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cause: {
    type: String,
    required: true,
    enum: ['meals', 'trees', 'essentials']
  },
  amount: {
    type: Number,
    required: true,
    min: 1
  },
  ngo: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'verified'],
    default: 'pending'
  },
  proof: {
    videoUrl: String,
    description: String
  },
  xpEarned: {
    type: Number,
    default: 10
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Donation', donationSchema);