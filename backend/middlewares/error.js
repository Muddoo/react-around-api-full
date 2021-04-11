module.exports = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      error: statusCode === 500
        ? 'Internal Server Error'
        : message,
    });
};
