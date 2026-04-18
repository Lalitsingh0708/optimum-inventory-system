const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    if (error.message.includes('IP address is not whitelisted')) {
      console.error(`Error: MongoDB Atlas Connection Refused. Please whitelist your IP in the Atlas Dashboard.`);
    } else {
      console.error(`Error: ${error.message}`);
    }
    process.exit(1);
  }
};

module.exports = connectDB;


