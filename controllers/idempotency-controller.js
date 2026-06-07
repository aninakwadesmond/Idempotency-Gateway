const {
  Idempotency,
  validateIdempotencyBody,
} = require('../models/idempotenty-model');

async function paymentProcessing(req, res, next) {
  const { error } = validateIdempotencyBody(req.body);

  if (error)
    return res.status(400).json({
      message:
        error?.details[0].message ?? 'amount and currency fields are required',
    });

  const { amount, currency } = req.body;

  console.log('amount', amount, 'currency', currency);
  const idempotencyRecord = req.idempotency;

  console.log('req idempotency ', idempotencyRecord);

  // simulating 2 seconds payment delay;
  await new Promise((r) => setTimeout(r, 2000));

  const responseBody = {
    status: 'success',
    message: 'Charged 100 GHS',
    transaction_id: idempotencyRecord._id,
    timeStamp: new Date().toISOString(),
  };

  let statusCode = 201;

  console.log('responsebody', responseBody);

  let response;

  try {
    response = await Idempotency.findByIdAndUpdate(
      idempotencyRecord._id,
      {
        status: 'completed',
        responseBody,
        statusCode,
      },
      { new: true },
    ).populate({ path: 'user', select: 'userName email' });
    console.log('update response', response);
  } catch (error) {
    console.log('error message', error);
    console.error(error?.message);
  }

  return res.status(statusCode).json(response);
}

module.exports = paymentProcessing;
