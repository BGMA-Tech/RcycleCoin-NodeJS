const errorResponse = (res, statusCode, message) => {
  return res.status(statusCode).json({
    status: false,
    error: {
      message: message.toString(),
    },
  });
};

module.exports = errorResponse;
