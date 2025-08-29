const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  pickup: {
    address: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  destination: {
    address: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  fare: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'in-progress', 'completed', 'cancelled'], 
    default: 'pending' 
  },
  bookingTime: { type: Date, default: Date.now },
  acceptedAt: Date,
  completedTime: Date,
  vehicleType: String
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);