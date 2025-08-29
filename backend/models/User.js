const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  phone: String,
  role: { type: String, default: 'user' },
  vehicleType: String,
  vehicleNumber: String,
  licenseNumber: String,
  location: {
    lat: Number,
    lng: Number,
    address: String
  },
  isAvailable: { type: Boolean, default: true },
  rating: { type: Number, default: 5.0 },
  totalRides: { type: Number, default: 0 }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);