const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const regularExpression = /^(https?:\/\/)(www\.)?[-a-zA-Z0-9._~:/?#[\]@!$&'()*+,;=]+#?$/;

const {
  createCard, returnCards, deleteCardById, likeCard, dislikeCard,
} = require('../controllers/cards');

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(regularExpression),
  }),
}), createCard);

router.get('/', returnCards);

router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }).unknown(true),
}), deleteCardById);

router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
}), likeCard);

router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
}), dislikeCard);

module.exports = router;
