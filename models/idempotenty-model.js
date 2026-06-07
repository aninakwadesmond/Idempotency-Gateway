const mongoose = require('mongoose');
const Joi = require('joi');

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

// valid user idempotency body request

function validateIdempotencyBody(req) {
  const schema = Joi.object({
    amount: Joi.number().required(),
    currency: Joi.string().required(),
  });

  return schema.validate(req, {
    abortEarly: false,
    allowUnknown: false,
    stripUnknown: true,
  });
}

module.exports = { Idempotency, validateIdempotencyBody };
