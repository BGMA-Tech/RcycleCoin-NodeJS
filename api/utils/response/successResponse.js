exports.successResponse = (res, statusCode, data) => {
  return res.status(statusCode).json({
    status: true,
    data,
  });
};
