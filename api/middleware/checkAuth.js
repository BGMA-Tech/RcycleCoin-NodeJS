const jwt = require('jsonwebtoken');
const Utils = require('../utils/response');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.userData = decoded;
    next();
  } catch (error) {
    return Utils.errorResponse(res, 401, {
      message: 'Auth failed',
    });
  }
};
