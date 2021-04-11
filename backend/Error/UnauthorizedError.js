class UnauthorizedError extends Error {
  constructor(message = 'Authorization Required') {
    super(message);
    this.statusCode = 401;
  }
}

module.exports = UnauthorizedError;
