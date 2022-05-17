const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequest = require('../errors/badRequest');
const NotFoundError = require('../errors/notFound');
const ConflictError = require('../errors/conflict');

const { NODE_ENV, JWT_SECRET } = process.env;

const createUser = (req, res, next) => {
  const {
    email,
    password,
    name,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash, // записываем хеш в базу
      name,
    }))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при создании пользователя.'));
      } else if (err.code === 11000) {
        next(new ConflictError('Пользователь с указанным email уже зарегистрирован'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key',
        { expiresIn: '7d' },
      );
      // res
      //   .cookie('jwt', token, {
      //     // token - наш JWT токен, который мы отправляем
      //     maxAge: 3600000,
      //     httpOnly: true,
      //     sameSite: true,
      //   })
      //   .send({ message: 'Успешный вход' });
      // вернём токен
      res.send({ token });
    })
    .catch(next);
};

const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(`Пользователь по указанному id=${req.user._id} не найден.`);
      }
      return res.status(200).send({ user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные при запросе пользователя.'));
      } else {
        next(err);
      }
    });
};

const patchUser = (req, res, next) => {
  const {
    name,
    email,
  } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError(`Пользователь с указанным id=${req.user._id} не найден.`);
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при обновлении профиля.'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createUser,
  login,
  getUser,
  patchUser,
};
