const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
  country: { // страна создания фильма
    type: String,
    required: true,
  },
  director: { // режиссер фильма
    type: String,
    required: true,
  },
  duration: { // длительность фильма
    type: Number,
    required: true,
  },
  year: { // год выпуска фильма
    type: String,
    required: true,
  },
  description: { // описание фильма
    type: String,
    required: true,
  },
  image: { // ссылка на постер к фильму
    type: String,
    minlength: 11,
    required: true,
    validate: {
      validator: (URL) => validator.isURL(URL),
      message: 'Введенные данные не являются ссылкой',
    },
  },
  trailerLink: { // ссылка на трейлер к фильму
    type: String,
    minlength: 11,
    required: true,
    validate: {
      validator: (URL) => validator.isURL(URL),
      message: 'Введенные данные не являются ссылкой',
    },
  },
  thumbnail: { // миниатюрное изображение постера к фильму
    type: String,
    minlength: 11,
    required: true,
    validate: {
      validator: (URL) => validator.isURL(URL),
      message: 'Введенные данные не являются ссылкой',
    },
  },
  owner: { // _id пользователя, который сохранил фильм
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: { // id фильма, доделать по данным из ответа сервиса MovieExplorer
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  nameEN: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
});

module.exports = mongoose.model('movie', movieSchema);
