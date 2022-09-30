const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const ConflictError = require('../errors/ConflictError');
const {
  conflictErrorMessage, validationErrorMessage, notFoundErrorMessageForUser,
} = require('../utils/constants');
const { secretKey } = require('../utils/config');

const SALT_ROUNDS = 10;

const createUser = (req, res, next) => {
  const { email, password, name } = req.body;
  bcrypt.hash(password, SALT_ROUNDS)
    .then((hash) => User.create({
      email, password: hash, name,
    }))
    .then((user) => res.send({
      name: user.name,
      email: user.email,
      _id: user._id,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError(conflictErrorMessage));
      } else if (err.name === 'ValidationError') {
        next(new ValidationError(validationErrorMessage));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : secretKey, { expiresIn: '7d' });
      return res.send({ token });
    })
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError(notFoundErrorMessageForUser);
    })
    .then((user) => res.send(user))
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .orFail(() => {
      throw new NotFoundError(notFoundErrorMessageForUser);
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError(conflictErrorMessage));
      } else if (err.name === 'ValidationError') {
        next(new ValidationError(validationErrorMessage));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createUser, login, getCurrentUser, updateUser,
};
