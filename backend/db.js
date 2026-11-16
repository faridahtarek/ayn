const mongoose = require('mongoose');

// Connects to MongoDB Atlas using the connection string in .env
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1); // stop the server if the database is unreachable
  }
};

module.exports = connectDB;
