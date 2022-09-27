const router = require('express').Router();
const { updateUser, getCurrentUser } = require('../controllers/users');
const { validateUser } = require('../utils/constants');

router.get('/users/me', getCurrentUser);

router.patch('/users/me', validateUser, updateUser);

module.exports = router;
