const router = require('express').Router();
const {
  getMovies,
  postMovie,
  delMovie,
} = require('../controllers/movies');

router.get('/', getMovies);
router.post('/', postMovie);
router.delete('/:movieId', delMovie);

module.exports = router;
