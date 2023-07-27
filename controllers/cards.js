const mongoose = require('mongoose');
const Card = require('../models/card');

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  if (!name || !link) {
    res
      .status(400)
      .send({ message: 'Невалидные данные' });
    return;
  }
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
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

const returnCards = (req, res) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch(() => {
      res
        .status(500)
        .send({ message: 'Ошибка сервера' });
    });
};

const deleteCardById = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Нет карточки с таким id' });
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.message === 'CastError') {
        res.status(400).send({ message: 'Введен некорректный id' });
        return;
      }
      res.status(500).send({ message: 'Ошибка сервера' });
    });
};

const likeCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Нет карточки с таким id' });
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.message === 'CastError') {
        res.status(400).send({ message: 'Введен некорректный id' });
        return;
      }
      res.status(500).send({ message: 'Ошибка сервера' });
    });
};

const dislikeCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Нет карточки с таким id' });
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.message === 'CastError') {
        res.status(400).send({ message: 'Введен некорректный id' });
        return;
      }
      res.status(500).send({ message: 'Ошибка сервера' });
    });
};

module.exports = {
  createCard, returnCards, deleteCardById, likeCard, dislikeCard,
};
