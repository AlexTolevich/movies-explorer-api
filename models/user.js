const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
// const UnauthorizedError = require('../errors/unauthorized');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (Email) => validator.isEmail(Email),
      message: 'Ошибка формата адреса почты',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Пользователь',
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        // return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            // return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
          }

          return user; // теперь user доступен
        });
    });
};

userSchema.methods.toJSON = function delPassword() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('user', userSchema);
