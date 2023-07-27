const mongoose = require('mongoose');
const User = require('../models/user');

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  if (!name || !about || !avatar) {
    res
      .status(400)
      .send({ message: 'Невалидные данные' });
    return;
  }
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch((error) => {
      // тут проверяем не является ли ошибка
      // ошибкой валидации
      if (error instanceof mongoose.Error.ValidationError) {
        res
          .status(400)
          .send({ message: 'Невалидные данные' });
        return;
      }

      // в остальных случаях выкидываем 500 ошибку
      res
        .status(500)
        .send({ message: 'Ошибка сервера' });
    });
};

const returnUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: 'Ошибка сервера' }));
};

const returnUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Нет пользователя с таким id' });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Невалидные данные' });
      } else {
        res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
};

const updateProfile = (req, res) => {
  const { name, about } = req.body;
  const { userId } = req.params;
  if (!name || !about) {
    res
      .status(400)
      .send({ message: 'Невалидные данные' });
    return;
  }
  User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Нет пользователя с таким id' });
      }
      return res.send({ data: { name, about } });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные в метод' });
        return;
      }
      res.status(500).send({ message: 'Ошибка сервера' });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const { userId } = req.params;
  if (!avatar) {
    res
      .status(400)
      .send({ message: 'Невалидные данные' });
    return;
  }
  User.findByIdAndUpdate(userId, { avatar })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Нет пользователя с таким id' });
      }
      return res.send({ data: { avatar } });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные в метод' });
        return;
      }
      res.status(500).send({ message: 'Ошибка сервера' });
    });
};

module.exports = {
  createUser, returnUsers, returnUserById, updateProfile, updateAvatar,
};
