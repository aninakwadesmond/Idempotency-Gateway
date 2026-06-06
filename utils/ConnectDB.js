const mongoose = require('mongoose');

async function ConnectDb() {
  try {
    const db = await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to db');
  } catch (error) {
    console.log(`Failed to connet to the db: ${error?.message}`);
  }
}

module.exports = { ConnectDb };
