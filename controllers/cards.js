const http2 = require('http2');
const Card = require('../models/card');

const NotFoundError = require('../erorrs/notFound');
const ForbiddenError = require('../erorrs/forbiddenError');

const {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
} = http2.constants;

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user.id;
  Card.create({ name, link, owner })
    .then((card) => res.status(HTTP_STATUS_CREATED).send({ data: card }))
    .catch(next);
};

const returnCards = (req, res, next) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch(next);
};

const deleteCardById = (req, res, next) => {
  const { cardId } = req.params;
  const { id } = req.user.id;

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Нет карточки с таким id');
      } else if (card.owner.toString() === id) {
        Card.findByIdAndRemove(cardId)
          .then((data) => {
            res.send({ data, message: 'Удалено' });
          })
          .catch(next);
      } else {
        throw new ForbiddenError('Вы не можете удалить карточку');
      }
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user.id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(new Error('NotValidId'))
    .then((card) => {
      res.status(HTTP_STATUS_OK).send({ data: card });
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        throw new NotFoundError('Нет карточки с таким id');
      }
    })
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user.id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(new Error('NotValidId'))
    .then((card) => {
      res.status(HTTP_STATUS_OK).send({ data: card });
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        throw new NotFoundError('Нет карточки с таким id');
      }
    })
    .catch(next);
};

module.exports = {
  createCard, returnCards, deleteCardById, likeCard, dislikeCard,
};
