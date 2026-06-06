function errorHandler(err, req, res, next) {
  console.error(err.message);
  return res.status(500).json({ message: 'system error' });
}

module.exports = { errorHandler };
