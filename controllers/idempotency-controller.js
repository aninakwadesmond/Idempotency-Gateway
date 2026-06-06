const { Idempotency } = require('../models/idempotenty-model');

async function paymentProcessing(req, res, next) {
  console.log('moved to controller');
  const { amount, currency } = req.body;
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
