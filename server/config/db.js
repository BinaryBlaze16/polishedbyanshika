const mongoose = require('mongoose');

const connectDB = async () => {
  let retries = 5;
  while (retries) {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/polishedbyanshika');
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      break;
    } catch (error) {
      console.error(`MongoDB Connection Error: ${error.message}`);
      retries -= 1;
      console.log(`Retries left: ${retries}`);
      if (retries === 0) {
        console.error('Could not connect to MongoDB after multiple retries.');
        process.exit(1);
      }
      await new Promise(res => setTimeout(res, 5000)); // wait 5 seconds
    }
  }
};

module.exports = connectDB;
