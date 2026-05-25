const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/docspot';
    const conn = await mongoose.connect(mongoURI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    // Attempt local fallback if Atlas fails and we aren't already trying it
    if (process.env.MONGO_URI && process.env.MONGO_URI !== 'mongodb://127.0.0.1:27017/docspot') {
      console.log('Attempting local MongoDB fallback...');
      try {
        const localConn = await mongoose.connect('mongodb://127.0.0.1:27017/docspot');
        console.log(`Fallback MongoDB Connected: ${localConn.connection.host}`);
      } catch (localError) {
        console.error(`Local MongoDB Fallback Failed: ${localError.message}`);
        process.exit(1);
      }
    } else {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
