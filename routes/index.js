const router = require('express').Router();
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const auth = require('../middlewares/auth');
const { login, createUser } = require('../controllers/users');
const NotFoundError = require('../errors/NotFoundError');
const { validateRegistration, validateLogin } = require('../utils/routesValidation');
const { crashTestMessage, notFoundErrorMessageForPath } = require('../utils/constants');

router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error(crashTestMessage);
  }, 0);
});

router.post('/signup', validateRegistration, createUser);

router.post('/signin', validateLogin, login);

router.use(auth);

router.use('/', usersRouter);
router.use('/', moviesRouter);

router.use('*', (req, res, next) => {
  next(new NotFoundError(notFoundErrorMessageForPath));
});

module.exports = router;
