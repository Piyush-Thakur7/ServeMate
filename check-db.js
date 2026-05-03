const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/servemate', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('Connected to MongoDB');

  // Get all users
  const User = require('./models/User');
  const users = await User.find({}).select('-password'); // Exclude passwords

  console.log('\n=== REGISTERED USERS ===');
  users.forEach((user, index) => {
    console.log(`${index + 1}. ${user.name} (${user.email}) - Level ${user.level}, XP: ${user.xp}`);
  });

  // Get all donations
  const Donation = require('./models/Donation');
  const donations = await Donation.find({}).populate('user', 'name email');

  console.log('\n=== DONATIONS ===');
  donations.forEach((donation, index) => {
    console.log(`${index + 1}. ${donation.user.name}: ₹${donation.amount} for ${donation.cause}`);
  });

  console.log(`\nTotal Users: ${users.length}`);
  console.log(`Total Donations: ${donations.length}`);

  process.exit(0);
})
.catch(err => {
  console.error('Connection error:', err);
  process.exit(1);
});