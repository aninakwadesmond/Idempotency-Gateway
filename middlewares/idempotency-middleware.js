const { Idempotency } = require('../models/idempotenty-model');
const { hashBody } = require('../utils/hashBody');
const { waitingForCompletion } = require('../utils/waitingForCompletion');

async function IdempotencyMiddleware(req, res, next) {
  //get the idepotency key in the req.header
  const key = req.headers['idempotency-key'];
  // console.log('key', key);
  const { id } = req.user;

  // console.log('userId', id);
  if (!key) {
    return res
      .status(400)
      .json({ message: 'Idempotency key is required in the header' });
  }
  // if key exist hashbody
  console.log('before body hashd');
  const bodyHash = hashBody(req.body);
  console.log('body hashed', bodyHash);

  // try to check whether the body exist with same key  in the db
  let record = await Idempotency.findOne({ key });

  // User Story 1: The First Transaction (Happy Path)
  if (!record) {
    try {
      console.log('before record', id, bodyHash);
      record = await Idempotency.create({
        key,
        bodyHash,
        status: 'processing',
        user: id,
      });

      console.log('before save', record);

      req.idempotency = record;

      // console.log('afer  save', req.idempotency, record);
      next();
      return;
    } catch (error) {
      //Race consition
      record = await Idempotency.findOne({ key });
    }
  }

  //  User Story 3: Different Request, Same Key (Fraud/Error Check)
  if (record.bodyHash !== bodyHash) {
    console.log('same key , different body');
    return res.status(409).json({
      message: 'Idempotency key already used for a different request body.',
    });
  }

  // Bonus User Story (The "In-Flight" Check)
  // in flight request one is processing with the same key and body
  if (record.status === 'processing') {
    try {
      record = await waitingForCompletion(key);

      return res.status(record.statusCode).json(record.responseBody);
    } catch (error) {
      return res.status(503).json({
        message: 'Processing timeout , Please  try again',
        err: error,
      });
    }
  }

  // User Story 2: The Duplicate Attempt (Idempotency Logic)
  res.set('X-Cache-Hit', 'true');
  return res.status(record.statusCode).json(record.responseBody);
}

module.exports = IdempotencyMiddleware;
