const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../Error/UnauthorizedError');

module.exports = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) return next(new UnauthorizedError());

  const token = authorization.replace('Bearer ', '');

  try {
    const payload = await jwt.verify(token, 'secret-key');
    req.user = payload;
    next();
  } catch (err) {
    next(new UnauthorizedError());
  }
};
