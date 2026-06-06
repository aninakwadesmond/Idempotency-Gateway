const mongoose = require('mongoose');

const idempotencySchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  bodyHash: { type: String, required: true },
  status: {
    type: String,
    enum: ['processing', 'completed'],
    default: 'processing',
  },
  responseBody: { type: Object, default: null },
  statusCode: { type: Number, default: null },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now, expires: '24h' },
});

const Idempotency = mongoose.model('Idempotency', idempotencySchema);

module.exports = { Idempotency };
