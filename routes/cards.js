const router = require('express').Router();

const {
  createCard, returnCards, deleteCardById, likeCard, dislikeCard,
} = require('../controllers/cards');

router.post('/', createCard);

router.get('/', returnCards);

router.delete('/:cardId', deleteCardById);

router.put('/:cardId/likes', likeCard);

router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
