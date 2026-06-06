const crypto = require('crypto');
function hashBody(reqBody) {
  const hashed = crypto
    .createHash('sha256')
    .update(JSON.stringify(reqBody))
    .digest('hex');

  return hashed;
}

module.exports = { hashBody };
