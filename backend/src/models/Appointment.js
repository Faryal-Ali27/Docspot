const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  patientName: {
    type: String,
    required: [true, 'Please add a patient name'],
    trim: true
  },
  patientAge: {
    type: Number,
    required: [true, 'Please add a patient age'],
    min: [0, 'Age cannot be negative']
  },
  patientGender: {
    type: String,
    required: [true, 'Please select gender'],
    enum: ['Male', 'Female', 'Other']
  },
  diseaseDescription: {
    type: String,
    required: [true, 'Please add a disease description or symptoms'],
    trim: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: [true, 'Please select a doctor']
  },
  date: {
    type: String,
    required: [true, 'Please select an appointment date']
  },
  timeSlot: {
    type: String,
    required: [true, 'Please select a time slot']
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Completed'],
    default: 'Pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Appointment', appointmentSchema);
