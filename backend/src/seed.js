require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Doctor = require('./models/Doctor');
const Appointment = require('./models/Appointment');
const User = require('./models/User');

const doctorsData = [
  {
    name: 'Dr. Sarah Jenkins',
    specialization: 'Cardiologist',
    experience: 12,
    availability: ['Monday', 'Wednesday', 'Friday'],
    timeSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM'],
    bio: 'Board-certified cardiologist specializing in preventive cardiovascular health, heart failure management, and advanced cardiac diagnostics.',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=300'
  },
  {
    name: 'Dr. Marcus Vance',
    specialization: 'Pediatrician',
    experience: 8,
    availability: ['Tuesday', 'Thursday'],
    timeSlots: ['09:00 AM', '10:00 AM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'],
    bio: 'Dedicated pediatrician focused on providing comprehensive childhood developmental assessments, immunizations, and compassionate childhood care.',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300'
  },
  {
    name: 'Dr. Aisha Rahman',
    specialization: 'Dermatologist',
    experience: 10,
    availability: ['Monday', 'Tuesday', 'Thursday'],
    timeSlots: ['10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '04:00 PM'],
    bio: 'Leading dermatologist with expertise in acne solutions, skin cancer screenings, cosmetic dermatology, and complex laser therapies.',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1591604021695-0c69b7c05981?auto=format&fit=crop&q=80&w=300'
  },
  {
    name: 'Dr. James Liu',
    specialization: 'General Physician',
    experience: 15,
    availability: ['Monday', 'Wednesday', 'Friday'],
    timeSlots: ['09:00 AM', '10:30 AM', '11:30 AM', '02:00 PM', '03:30 PM', '04:30 PM'],
    bio: 'Highly experienced family doctor skilled in managing chronic illnesses, performing annual physical checkups, and providing holistic wellness advice.',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300'
  },
  {
    name: 'Dr. Elena Rostova',
    specialization: 'Neurologist',
    experience: 14,
    availability: ['Wednesday', 'Thursday', 'Friday'],
    timeSlots: ['09:30 AM', '10:30 AM', '11:30 AM', '02:30 PM', '03:30 PM'],
    bio: 'Specialist neurologist focusing on headaches, migraine care, sleep disorders, clinical neurophysiology, and neurodegenerative conditions.',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300'
  }
];

const seedDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/docspot';
    console.log(`Connecting database for seeding: ${mongoURI}`);
    await mongoose.connect(mongoURI);

    // Clear existing doctors
    await Doctor.deleteMany();
    console.log('Existing doctors deleted.');
    
    // Clear appointments
    await Appointment.deleteMany();
    console.log('Existing appointments cleared.');

    // Clear users
    await User.deleteMany();
    console.log('Existing users deleted.');

    // Seed doctors
    await Doctor.insertMany(doctorsData);
    console.log('Default doctor profiles seeded successfully!');

    // Seed default Patient User
    const user = await User.create({
      name: 'Default Patient',
      email: 'user@docspot.health',
      password: 'password123',
      role: 'user'
    });
    console.log(`Patient account seeded: email='${user.email}', password='password123'`);

    // Seed default Admin User
    const admin = await User.create({
      name: 'Default Admin',
      email: 'admin@docspot.health',
      password: 'admin123',
      role: 'admin'
    });
    console.log(`Admin account seeded: email='${admin.email}', password='admin123'`);

    mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding database failed:', error);
    process.exit(1);
  }
};

seedDB();
