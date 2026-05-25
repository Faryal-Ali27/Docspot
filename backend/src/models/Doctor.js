const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a doctor name'],
    trim: true
  },
  specialization: {
    type: String,
    required: [true, 'Please add a specialization'],
    trim: true
  },
  experience: {
    type: Number,
    required: [true, 'Please add years of experience']
  },
  availability: {
    type: [String],
    default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  },
  timeSlots: {
    type: [String],
    default: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM']
  },
  bio: {
    type: String,
    default: 'Experienced healthcare specialist dedicated to providing exceptional patient care and clinical excellence.'
  },
  rating: {
    type: Number,
    default: 4.8
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Doctor', doctorSchema);
