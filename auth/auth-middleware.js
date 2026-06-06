const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  const cookiesToken = req.cookies?.jwt;

  if ((!authHeader || authHeader.split(' ')[0] !== 'Bearer') && !cookiesToken) {
    return res
      .status(403)
      .json({ message: 'Unauthorized user. Please register for a token' });
  }

  let token;

  if (cookiesToken) {
    token = cookiesToken;
  } else {
    token = authHeader.split(' ')[1];
  }

  if (!token)
    return res
      .send(403)
      .json({ message: 'Unauthorized user. Please register for a token' });

  try {
    const decode = jwt.decode(token, process.env.JWT_SECRET_KEY);

    req.user = decode;

    next();
  } catch (error) {
    return res
      .send(400)
      .json({ message: error?.message || 'token not reusable' });
  }
}

module.exports = { authMiddleware };
