const router = require('express').Router();
const {
  getMovies,
  postMovie,
  delMovie,
} = require('../controllers/movies');

const { validationMovie, validationMoveId } = require('../middlewares/validation');

router.get('/', getMovies);
router.post('/', validationMovie, postMovie);
router.delete('/:movieId', validationMoveId, delMovie);

module.exports = router;
