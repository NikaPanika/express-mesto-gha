const User = require('../models/user');

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch(() => res.status(400).send({ message: 'Переданы некорректные данные' }));
};

const returnUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

const returnUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(404).send({ message: 'Запрашиваемый пользователь не найден' }));
};

const updateProfile = (req, res) => {
  const { name, about } = req.body;
  const { userId } = req.params;
  User.findByIdAndUpdate(userId, { name, about })
    .then(() => res.status(200).send({ data: { name, about } }))
    .catch(() => res.status(400).send({ message: 'Не удается обновить информацию' }));
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const { userId } = req.params;
  User.findByIdAndUpdate(userId, { avatar })
    .then(() => res.status(200).send({ data: { avatar } }))
    .catch(() => res.status(400).send({ message: 'Не удается обновить аватар' }));
};

module.exports = {
  createUser, returnUsers, returnUserById, updateProfile, updateAvatar,
};
