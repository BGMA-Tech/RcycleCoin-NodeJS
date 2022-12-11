exports.successResponse = (res, statusCode, jsonMessage) => {
  return res.status(statusCode).json({
    status: true,
    jsonMessage,
  });
};
