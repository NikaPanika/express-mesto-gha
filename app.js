const express = require('express');
const mongoose = require('mongoose');
const http2 = require('http2');
const routes = require('./routes/index');

const { PORT = 3000 } = process.env;

const {
  HTTP_STATUS_NOT_FOUND,
} = http2.constants;

const app = express();
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: '64bf084767c98cebcedbc2db', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use('/', routes);
app.use('/', (req, res) => {
  res.set({ 'content-type': 'application/json; charset=utf-8' });
  res.status(HTTP_STATUS_NOT_FOUND).end(JSON.stringify({ message: 'Запрашиваемый ресурс не найден' }), 'utf8');
});
app.listen(PORT);
