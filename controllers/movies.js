const Movie = require('../models/movie');
const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');
const {
  validationErrorMessage, notFoundErrorMessageForMovie,
  forbiddenErrorMessage, movieRemovedMessage, castErrorMessage,
} = require('../utils/constants');

const getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => {
      res.send(movies);
    })
    .catch(next);
};

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user._id,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError(validationErrorMessage));
      }
      return next(err);
    });
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(() => {
      throw new NotFoundError(notFoundErrorMessageForMovie);
    })
    .then((movie) => {
      if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenError(forbiddenErrorMessage);
      } else {
        return movie.remove()
          .then(() => res.send({ message: movieRemovedMessage }));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ValidationError(castErrorMessage));
      }
      return next(err);
    });
};

module.exports = {
  getMovies, createMovie, deleteMovie,
};
