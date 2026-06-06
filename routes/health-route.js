const { Router } = require('express');
const { healthController } = require('../controllers/health-controller');
const healthRoute = Router();

healthRoute.get('/', healthController);

module.exports = healthRoute;
