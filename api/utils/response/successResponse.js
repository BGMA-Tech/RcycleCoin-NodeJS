const successResponse = (res, statusCode, data, message) => {
  return res.status(statusCode).json({
    status: true,
    data,
  });
};

module.exports = successResponse;
