const mongoose = require('mongoose');

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    console.error('\n❌ FATAL: MONGODB_URI environment variable is missing!');
    console.error('   Please set MONGODB_URI in your Railway environment variables.\n');
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }

  let retries = 5;
  while (retries > 0) {
    try {
      if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI is not defined in environment variables.');
      }
      const conn = await mongoose.connect(process.env.MONGODB_URI);
      console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      console.error(`❌ MongoDB Connection Error: ${error.message}`);
      retries -= 1;
      if (retries === 0) {
        console.error('❌ Could not connect to MongoDB after 5 attempts. Exiting...');
        process.exit(1);
      }
      console.log(`⏳ Retrying MongoDB connection in 5s... (${retries} attempts left)`);
      await new Promise((res) => setTimeout(res, 5000));
    }
  }
};

module.exports = connectDB;
