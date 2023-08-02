const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const regularExpression = /^(https?:\/\/)(www\.)?[-a-zA-Z0-9._~:/?#[\]@!$&'()*+,;=]+#?$/;

const {
  returnUsers, returnUserById, updateProfile, updateAvatar, getUser,
} = require('../controllers/users');

router.get('/', returnUsers);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
}), returnUserById);

router.get('/me', getUser);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateProfile);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(regularExpression),
  }),
}), updateAvatar);

module.exports = router;
