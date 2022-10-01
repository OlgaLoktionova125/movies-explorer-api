const validator = require('validator');
const ValidationError = require('../errors/ValidationError');
const { incorrectUrlMessage } = require('./constants');

const isUrlValid = (url) => {
  if (!validator.isURL(url)) {
    throw new ValidationError(incorrectUrlMessage);
  }
  return url;
};

module.exports = isUrlValid;
