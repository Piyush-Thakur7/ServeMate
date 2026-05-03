const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/servemate', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('🔍 DATABASE MONITORING DASHBOARD');
  console.log('=====================================\n');

  const User = require('./models/User');
  const Donation = require('./models/Donation');

  // Get total stats
  const totalUsers = await User.countDocuments();
  const totalDonations = await Donation.countDocuments();
  const totalAmount = await Donation.aggregate([
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);

  console.log(`📊 TOTAL STATS:`);
  console.log(`   Users: ${totalUsers}`);
  console.log(`   Donations: ${totalDonations}`);
  console.log(`   Total Amount: ₹${totalAmount[0]?.total || 0}\n`);

  // Get recent users (last 10)
  const recentUsers = await User.find({})
    .sort({ createdAt: -1 })
    .limit(10)
    .select('name email city level xp createdAt');

  console.log(`👥 RECENT USERS (Last 10):`);
  recentUsers.forEach((user, index) => {
    const date = user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown';
    console.log(`   ${index + 1}. ${user.name} (${user.email}) - Level ${user.level}, XP: ${user.xp} - ${date}`);
  });

  // Get recent donations (last 10)
  const recentDonations = await Donation.find({})
    .sort({ createdAt: -1 })
    .limit(10)
    .populate('user', 'name email');

  console.log(`\n💰 RECENT DONATIONS (Last 10):`);
  recentDonations.forEach((donation, index) => {
    const date = donation.createdAt ? new Date(donation.createdAt).toLocaleString() : 'Unknown';
    console.log(`   ${index + 1}. ${donation.user.name}: ₹${donation.amount} for ${donation.cause} - ${date}`);
  });

  // Get top donors
  const topDonors = await User.find({})
    .sort({ totalDonated: -1 })
    .limit(5)
    .select('name email totalDonated donationsCount level');

  console.log(`\n🏆 TOP DONORS:`);
  topDonors.forEach((user, index) => {
    console.log(`   ${index + 1}. ${user.name} - ₹${user.totalDonated} (${user.donationsCount} donations) - Level ${user.level}`);
  });

  console.log('\n✅ Database monitoring complete!');
  process.exit(0);
})
.catch(err => {
  console.error('❌ Connection error:', err);
  process.exit(1);
});