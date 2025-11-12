const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/swiftchat', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB ga ulandi: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB ulanish xatosi:', error.message);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('✅ MongoDB ulanishi uzildi');
  } catch (error) {
    console.error('❌ MongoDB ulanishini uzish xatosi:', error);
  }
};

module.exports = { connectDB, disconnectDB };