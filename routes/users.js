const router = require('express').Router();

const {
  createUser, returnUsers, returnUserById, updateProfile, updateAvatar,
} = require('../controllers/users');

router.post('/', createUser);

router.get('/', returnUsers);

router.get('/:userId', returnUserById);

router.patch('/me/:userId', updateProfile);

router.patch('/me/avatar/:userId', updateAvatar);

module.exports = router;
