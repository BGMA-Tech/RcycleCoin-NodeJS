const successResponse = (res, statusCode, data) => {
  return res.status(statusCode).json({
    status: true,
    data,
  });
};

module.exports = successResponse;
