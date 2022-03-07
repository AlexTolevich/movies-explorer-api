const router = require('express').Router();
const usersRoutes = require('./users');
const moviesRoutes = require('./movies');
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/notFound');
const { validationLogin, validationUser } = require('../middlewares/validation');

router.post('/signin', validationLogin, login);
router.post('/signup', validationUser, createUser);

router.use(auth);

router.use('/users', usersRoutes);
router.use('/movies', moviesRoutes);

router.use((req, res, next) => {
  next(new NotFoundError());
});

module.exports = router;
