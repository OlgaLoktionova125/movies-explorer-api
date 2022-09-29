const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const AuthorisationError = require('../errors/AuthorisationError');
const { secretKey } = require('../utils/config');
const { authorisationErrorMessage } = require('../utils/constants');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer')) {
    throw new AuthorisationError(authorisationErrorMessage);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : secretKey);
  } catch (err) {
    next(new AuthorisationError(authorisationErrorMessage));
    return;
  }

  req.user = payload;

  next();
};
