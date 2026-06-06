const { User } = require('../models/users-model');
const _ = require('lodash');

async function userRegisterController(req, res, next) {
  // const { id, email } = req.user;
  const { email, name, password } = req.body;

  console.log('email', email, name, password);

  const existUser = await User.findOne({ email });
  if (existUser)
    return res.status(401).json({ message: 'user exit already !' });

  try {
    console.log('try before');
    const user = await User.create({ name, email, password });
    console.log('try after');

    const token = user.genAuthToken();

    const isProd = process.env.NODE_ENV == 'production';
    const cookieOptions = {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    res.header('jwt', token);
    // set cookies in to client user

    // frontend usage but visible with nodemon
    res.cookie('jwt', token, cookieOptions);

    const responseUser = _.pick(user, ['name', 'email', '_id']);

    console.log(responseUser, token);

    return res
      .status(201)
      .setHeader('jwt', token)
      .json({
        result: { status: 'successfully registered', ...responseUser },
        token,
      });
  } catch (error) {
    console.log(error?.message);
    console.error(error);
    return res
      .status(400)
      .json({ message: 'Cannot save user' }, error?.message);
  }
}

async function userLoginController(req, res, next) {
  const { id, email } = req.user;
  const { email: userEmail, password } = req.body;
  if (!id || !email)
    return res.status(404).json({ message: 'invalid email or password' });

  const existUser = await User.findById(id);
  if (!existUser)
    return res.status(401).json({ message: 'User does not exist in the db' });

  if (userEmail !== email)
    return res.status(403).json({ message: 'Invalid email or Password' });

  const isSamePassword = existUser.comparePassword(password);
  if (!isSamePassword)
    return res.status(403).json({ message: 'Invalid email or Password' });

  const token = existUser.genAuthToken();
  const isProduction = process.env.NODE_ENV == 'production';

  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  res.setHeader('x-auth-token', token);
  res.cookie('jwt', token, cookieOptions);

  return res
    .status(200)
    .json({ message: 'successfully login', existUser, token });
  // if (password !== e)
}

module.exports = { userLoginController, userRegisterController };
