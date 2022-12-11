const crypto = require('crypto');

exports.createHash = (data) => {
  const hash = crypto.createHash('sha256');
  hash.update(data);
  return hash.digest('hex');
};
