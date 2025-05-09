const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  city: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  programs: [{ type: String, required: true }],
  reason: { type: String, required: true },
  occupation: { type: String, required: true },
  religion: { type: String, required: true },
  age: { type: Number, required: true },
  comment: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Volunteer', volunteerSchema);
