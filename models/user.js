const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const AuthorisationError = require('../errors/AuthorisationError');
const { incorrectEmailMessage, wrongAuthorisationData } = require('../utils/constants');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    validate: [validator.isEmail, incorrectEmailMessage],
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
});

userSchema.set('versionKey', false);

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new AuthorisationError(wrongAuthorisationData));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new AuthorisationError(wrongAuthorisationData));
          }
          return user;
        });
    });
};

const User = mongoose.model('user', userSchema);

module.exports = User;
