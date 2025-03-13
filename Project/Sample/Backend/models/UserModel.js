const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // existing fields...
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  // Add fields for premium membership
  isPremium: { type: Boolean, default: false },
  paymentStatus: { type: String, default: 'pending' },
  // other fields...
});

module.exports = mongoose.model('User', userSchema); 