const { Router } = require('express');
const userRoute = Router();
const {
  userRegisterController,
  userLoginController,
} = require('../controllers/user-controller');

const { authMiddleware } = require('../auth/auth-middleware');

userRoute.post('/register', userRegisterController);

userRoute.post('/login', authMiddleware, userLoginController);

module.exports = { userRoute };
