const { centralErrorMessage } = require('../utils/constants');

module.exports = (err, req, res, next) => {
  const { statusCode, message } = err;
  res.status(err.statusCode).send({
    message: statusCode === 500
      ? centralErrorMessage
      : message,
  });
  next();
};
