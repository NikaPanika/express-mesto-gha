const jwt = require('jsonwebtoken');
const AuthError = require('../erorrs/authError');

const JWT_SECRET = 'strange-secret-key';

const auth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    throw new AuthError('Сначала авторизируйтесь');
  }
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new AuthError('Сначала авторизируйтесь');
  }

  req.user = payload;

  next();
};

module.exports = auth;
