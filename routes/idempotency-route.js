const { Router } = require('express');
const IdempotencyMiddleware = require('../middlewares/idempotency-middleware');
const paymentProcessing = require('../controllers/idempotency-controller');
const { authMiddleware } = require('../auth/auth-middleware');
const paymentRoute = Router();

paymentRoute.post(
  '/',
  authMiddleware,
  IdempotencyMiddleware,
  paymentProcessing,
);

module.exports = paymentRoute;
