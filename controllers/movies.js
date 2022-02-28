const Movie = require('../models/movie');

const getMovies = (req, res, next) => {
  Movie.find({})
    .then((movie) => res.status(200).send(movie))
    .catch(next);
};

const postMovie = (req, res, next) => {
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
  })
    .then((movie) => res.status(200).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        // next(new BadRequest('Переданы некорректные данные при создании фильма.'));
      } else {
        next(err);
      }
    });
};

const delMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(() => {
      // throw new NotFoundError(`Фильм с указанным id=${req.params.movieId} не найден.`);
    })
    .then((movie) => {
      if (req.user._id === movie.owner.toString()) {
        Movie.findByIdAndRemove(req.params.movieId)
          .then(() => {
            res.status(200).send(movie);
          })
          .catch(next);
      } else {
        // throw new ForbiddenError('Отсутствуют права на удаление фильма');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        // next(new BadRequest('Переданы некорректные данные при удалении фильма.'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getMovies,
  postMovie,
  delMovie,
};
