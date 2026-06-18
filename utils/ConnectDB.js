const mongoose = require('mongoose');
const config = require('config');

async function ConnectDb() {
  try {
    console.log('try to conect to db');
    const db = await mongoose.connect(config.get('MONGO_URL'));
    console.log('Connected to db');
  } catch (error) {
    console.error(`Failed to connet to the db: ${error?.message}`);
  }
}

module.exports = { ConnectDb };
